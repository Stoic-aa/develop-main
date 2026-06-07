import markdown
import sys
from pathlib import Path

def md_to_html(md_file, html_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    md = markdown.Markdown(extensions=['meta'])
    html_body = md.convert(md_content)
    
    # 提取元数据
    meta = md.Meta if hasattr(md, 'Meta') else {}
    
    html_template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{meta.get('title', [''])[0] if meta.get('title') else 'Markdown Document'}</title>
</head>
<body>
{html_body}
</body>
</html>"""
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_template)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方法: python md_change_to_html.py <input.md> [output.html]")
        sys.exit(1)
    
    input_md = sys.argv[1]
    
    # 如果提供了输出文件名，则使用它；否则自动生成
    if len(sys.argv) > 2:
        output_html = sys.argv[2]
    else:
        # 自动生成输出文件名：将 .md 扩展名替换为 .html
        input_path = Path(input_md)
        output_html = input_path.with_suffix('.html')
    
    # 检查输入文件是否存在
    if not Path(input_md).exists():
        print(f"错误: 输入文件 '{input_md}' 不存在")
        sys.exit(1)
    
    md_to_html(input_md, output_html)
    print(f"成功将 '{input_md}' 转换为 '{output_html}'")