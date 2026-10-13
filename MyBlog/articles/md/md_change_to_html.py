#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
md_change_to_html.py —— Markdown 正文 → 文章正文片段，并同步维护文章数据源

用法:
    python md_change_to_html.py <a.md> [b.md ...]     转换指定 md
    python md_change_to_html.py --all                 转换 md/ 目录下所有 md
    python md_change_to_html.py <a.md> --no-register  只转换正文，不写 articles-data.js

产物:
    articles/content/<slug>.html   纯正文片段，直接注入 article-template.html 的 #article-content

约定:
    1. 正文片段不含 <html>/<head>/<body>，只有内容块本身（旧的整份文档写法是错的，
       注入模板后会嵌套 html/body，必须避免）。
    2. 图片等资源路径按「相对 articles/ 目录」书写，例如
       <img src="./picture/xxx/cover.webp"> —— 注入后以详情页 /articles/article-template.html 为基准解析。
    3. 顶部 front-matter（--- 包裹）字段：
         title(必填) / summary / category / date / readTime / author
         tags(数组) / coverImage / authorAvatar / categoryPage / lastUpdated
       date 支持 2026-08-16 或 2026年8月16日 两种写法，输出统一为「2026年8月16日」。
    4. 代码块语言会归一化为 MicroLighter 的语法名（c++→cpp、py→python、sh→bash ...）。
    5. 若正文第一个标题与 front-matter 的 title 完全相同，会自动去掉（避免与页面标题重复）。
"""

import argparse
import json
import re
import sys
from datetime import date as _date
from pathlib import Path

import markdown

# ====================== 路径配置 ======================
SCRIPT_DIR = Path(__file__).parent.resolve()          # .../articles/md
ARTICLES_DIR = SCRIPT_DIR.parent                      # .../articles
CONTENT_DIR = ARTICLES_DIR / 'content'                # .../articles/content
DATA_FILE = ARTICLES_DIR.parent / 'js' / 'articles-data.js'   # .../js/articles-data.js

# 占位图：当 front-matter 未给出 coverImage 时使用
DEFAULT_COVER = './articles/picture/image.webp'
DEFAULT_AVATAR = './picture/author.webp'

# ====================== 代码块语言归一化 ======================
# 目标值必须是 js/vendor/microlighter/grammars/ 下真实存在的文件名
LANGUAGE_ALIASES = {
    'c++': 'cpp', 'cpp': 'cpp', 'cplusplus': 'cpp', 'cc': 'cpp', 'hpp': 'cpp',
    'c': 'c', 'h': 'c',
    'py': 'python', 'python3': 'python', 'python': 'python',
    'sh': 'bash', 'shell': 'bash', 'zsh': 'bash', 'console': 'bash',
    'shell-session': 'bash', 'bash': 'bash',
    'js': 'javascript', 'jsx': 'javascript', 'node': 'javascript', 'javascript': 'javascript',
    'ts': 'typescript', 'typescript': 'typescript',
    'yml': 'yaml', 'yaml': 'yaml',
    'md': 'markdown', 'markdown': 'markdown',
    'cs': 'csharp', 'c#': 'csharp', 'csharp': 'csharp',
    'objc': 'objective-c', 'objectivec': 'objective-c', 'objective-c': 'objective-c',
    'ps1': 'powershell', 'ps': 'powershell', 'powershell': 'powershell',
    'docker': 'dockerfile', 'dockerfile': 'dockerfile',
    'rb': 'ruby', 'kt': 'kotlin', 'htm': 'html',
}


def normalize_languages(html: str) -> str:
    """把 class="language-xxx" 归一化为 MicroLighter 认识的语法名。"""
    def repl(match: re.Match) -> str:
        raw = match.group(1).strip().lower()
        return 'class="language-%s"' % LANGUAGE_ALIASES.get(raw, raw)

    return re.sub(r'class="language-([^"]+)"', repl, html)


# ====================== front-matter 解析 ======================
def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def _parse_list(value: str):
    inner = value.strip()[1:-1].strip()
    if not inner:
        return []
    return [_strip_quotes(item) for item in inner.split(',') if item.strip()]


def parse_front_matter(text: str):
    """
    解析顶部 `---` 包裹的 front-matter（仅支持 key: value 与 key: [a, b] 两种形式）。
    返回 (meta_dict, 去掉 front-matter 的正文)。
    """
    lines = text.splitlines()
    if not lines or lines[0].strip() != '---':
        return {}, text

    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            end = i
            break
    if end is None:
        return {}, text

    meta = {}
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        if ':' not in line:
            continue
        key, value = line.split(':', 1)
        key, value = key.strip(), value.strip()
        meta[key] = _parse_list(value) if value.startswith('[') else _strip_quotes(value)

    return meta, '\n'.join(lines[end + 1:])


def normalize_date(value: str) -> str:
    """2026-08-16 / 2026/8/16 / 2026年8月16日 → 2026年8月16日；留空则取今天。"""
    if not value:
        today = _date.today()
        return '%d年%d月%d日' % (today.year, today.month, today.day)
    m = re.search(r'(\d{4})\D+(\d{1,2})\D+(\d{1,2})', value)
    if m:
        return '%d年%d月%d日' % (int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return value.strip()


# ====================== 正文转换 ======================
# extra = tables + attr_list + md_in_html + footnotes + def_list + abbr（覆盖写作常用语法）
# fenced_code 提供 ``` 代码块；sane_lists 提供更符合直觉的列表解析
MD_EXTENSIONS = ['extra', 'fenced_code', 'sane_lists']

# 匹配列表项行：前导空格 + 列表标记 + 一个空白字符
LIST_ITEM_RE = re.compile(r'^( *)([-*+]|\d+[.)])(\s)')
FENCE_RE = re.compile(r'^\s*(```|~~~)')


def normalize_list_indent(text: str) -> str:
    """
    统一嵌套列表缩进。

    Python-Markdown 只认「4 空格 = 一层」，而不少编辑器默认缩进 2 空格，
    直接转换会退化成平铺列表。这里先探测文档实际使用的缩进单位，
    若为 2 空格则整体放大为 4 空格，从而两种书写习惯都能正确嵌套。
    跳过围栏代码块内部，避免误改代码。
    """
    lines = text.split('\n')

    unit = None
    in_fence = False
    for line in lines:
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = LIST_ITEM_RE.match(line)
        if match and len(match.group(1)) > 0:
            indent = len(match.group(1))
            if unit is None or indent < unit:
                unit = indent

    if unit != 2:
        return text

    in_fence = False
    for index, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = LIST_ITEM_RE.match(line)
        if match and len(match.group(1)) > 0:
            indent = len(match.group(1))
            lines[index] = ' ' * (indent * 2) + line[indent:]

    return '\n'.join(lines)


def strip_duplicate_title(html: str, title: str) -> str:
    """若正文首个标题与页面标题完全一致，则删掉，避免重复展示。"""
    if not title:
        return html
    pattern = re.compile(
        r'^\s*<h([12])[^>]*>(.*?)</h\1>\s*', re.DOTALL | re.IGNORECASE)
    match = pattern.match(html)
    if match:
        heading_text = re.sub(r'<[^>]+>', '', match.group(2)).strip()
        if heading_text == title.strip():
            return html[match.end():]
    return html


def convert_markdown(md_text: str, title: str) -> str:
    md = markdown.Markdown(extensions=MD_EXTENSIONS, output_format='html5')
    fragment = md.convert(normalize_list_indent(md_text))
    fragment = strip_duplicate_title(fragment, title)
    return normalize_languages(fragment)


# ====================== articles-data.js 写入 ======================
def _skip_comment_or_string(text: str, i: int, in_str):
    """辅助：判断位置 i 是否处于注释/字符串中；返回 (新索引, 新 in_str)。"""
    if in_str:
        if text[i] == '\\':
            return i + 2, in_str
        if text[i] == in_str:
            return i + 1, None
        return i + 1, in_str

    two = text[i:i + 2]
    if two == '//':
        nl = text.find('\n', i)
        return (len(text) if nl == -1 else nl + 1), None
    if two == '/*':
        end = text.find('*/', i + 2)
        return (len(text) if end == -1 else end + 2), None
    if text[i] in ('"', "'", '`'):
        return i + 1, text[i]
    return i, None


def find_array_span(text: str):
    """定位 `const articlesData = [ ... ]` 中方括号的位置。"""
    match = re.search(r'const\s+articlesData\s*=\s*\[', text)
    if not match:
        raise SystemExit('未在 %s 中找到 `const articlesData = [`' % DATA_FILE)

    start = match.end() - 1
    depth, in_str, i = 0, None, start
    while i < len(text):
        new_i, new_str = _skip_comment_or_string(text, i, in_str)
        if new_i != i:
            i, in_str = new_i, new_str
            continue
        if text[i] in '[{(':
            depth += 1
        elif text[i] in ']})':
            depth -= 1
            if depth == 0:
                return start, i
        i += 1
    raise SystemExit('articlesData 数组括号不匹配')


def split_top_level_objects(inner: str):
    """把数组内部按顶层 `{...}` 切分，返回 [(相对起点, 相对终点)]。"""
    spans, depth, in_str, start, i = [], 0, None, None, 0
    while i < len(inner):
        new_i, new_str = _skip_comment_or_string(inner, i, in_str)
        if new_i != i:
            i, in_str = new_i, new_str
            continue
        ch = inner[i]
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                spans.append((start, i + 1))
                start = None
        i += 1
    return spans


def _slug_of_object(obj_text: str) -> str:
    m = re.search(r'slug=([A-Za-z0-9_\-]+)', obj_text)
    if m:
        return m.group(1)
    m = re.search(r'"articles/content/([^"]+)\.html"', obj_text)
    return m.group(1) if m else ''


def build_entry(meta: dict, slug: str, entry_id: int) -> str:
    """生成一个 articlesData 条目字面量，字段对齐风格与现有条目保持一致。"""
    title = meta.get('title', slug)
    fields = [
        ('id', entry_id),
        ('title', title),
        ('summary', meta.get('summary', '')),
        ('category', meta.get('category', '未分类')),
        ('date', normalize_date(meta.get('date', ''))),
        ('readTime', meta.get('readTime', '')),
        ('author', meta.get('author', 'Ethan')),
        ('authorAvatar', meta.get('authorAvatar', DEFAULT_AVATAR)),
        ('coverImage', meta.get('coverImage', DEFAULT_COVER)),
        ('url', 'articles/article-template.html?slug=%s' % slug),
        ('contentFile', 'articles/content/%s.html' % slug),
        ('categoryPage', meta.get('categoryPage', 'index.html')),
        ('tags', meta.get('tags', [])),
        ('lastUpdated', normalize_date(meta.get('lastUpdated', meta.get('date', '')))),
    ]

    lines = ['{']
    for index, (key, value) in enumerate(fields):
        literal = json.dumps(value, ensure_ascii=False)
        comma = '' if index == len(fields) - 1 else ','
        lines.append('            %-14s: %s%s' % (key, literal, comma))
    lines.append('        }')
    return '\n'.join(lines)


def upsert_article(meta: dict, slug: str, data_file: Path = DATA_FILE) -> str:
    """在 articles-data.js 中新增或更新（按 slug 匹配）一条文章条目。"""
    text = data_file.read_text(encoding='utf-8')
    array_start, array_end = find_array_span(text)
    inner = text[array_start + 1:array_end]

    objects, existing_index, existing_id = [], None, None
    for begin, end in split_top_level_objects(inner):
        obj_text = inner[begin:end]
        if _slug_of_object(obj_text) == slug:
            existing_index = len(objects)
            id_match = re.search(r'\bid\s*:\s*(\d+)', obj_text)
            existing_id = int(id_match.group(1)) if id_match else None
        objects.append(obj_text)

    all_ids = [int(m.group(1)) for o in objects for m in [re.search(r'\bid\s*:\s*(\d+)', o)] if m]
    entry_id = existing_id if existing_id is not None else (max(all_ids, default=0) + 1)
    entry_text = build_entry(meta, slug, entry_id)

    if existing_index is None:
        objects.append(entry_text)
        action = '新增'
    else:
        objects[existing_index] = entry_text
        action = '更新'

    rebuilt = '[\n' + ',\n'.join('        ' + obj for obj in objects) + '\n    ]'
    data_file.write_text(text[:array_start] + rebuilt + text[array_end + 1:], encoding='utf-8')
    return action


# ====================== 主流程 ======================
def process(md_path: Path, register: bool) -> None:
    slug = md_path.stem
    raw = md_path.read_text(encoding='utf-8')
    meta, body = parse_front_matter(raw)

    fragment = convert_markdown(body, meta.get('title', ''))
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = CONTENT_DIR / ('%s.html' % slug)
    out_path.write_text(fragment, encoding='utf-8')
    print('正文片段: %s (%d 字符)' % (out_path, len(fragment)))

    if register:
        if not meta.get('title'):
            print('  跳过注册: front-matter 缺少 title')
            return
        action = upsert_article(meta, slug)
        print('文章条目: %s articles-data.js -> %s' % (action, slug))


def main() -> None:
    parser = argparse.ArgumentParser(description='Markdown 正文 → 文章正文片段 + 同步文章数据源')
    parser.add_argument('inputs', nargs='*', help='要转换的 md 文件')
    parser.add_argument('--all', action='store_true', help='转换 md/ 目录下的所有 md')
    parser.add_argument('--no-register', action='store_true', help='不写入 articles-data.js')
    args = parser.parse_args()

    if args.all:
        targets = sorted(SCRIPT_DIR.glob('*.md'))
    else:
        targets = [Path(p) for p in args.inputs]

    if not targets:
        parser.print_help()
        sys.exit(1)

    missing = [str(p) for p in targets if not p.exists()]
    if missing:
        raise SystemExit('文件不存在: %s' % ', '.join(missing))

    for md_path in targets:
        print('==> %s' % md_path.name)
        process(md_path, register=not args.no_register)


if __name__ == '__main__':
    main()
