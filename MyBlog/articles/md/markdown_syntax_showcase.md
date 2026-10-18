---
title: "Markdown 写作与代码高亮测试"
summary: "一篇用于验证写作链路的内容样例：涵盖标题、列表、表格、引用、分割线以及 C / C++ / Bash / Python / Java / CSS 等多语言代码块。"
author: "Ethan"
date: "2026-10-14"
category: "写作"
tags: ["Markdown", "写作", "语法高亮"]
readTime: "阅读时间 8 分钟"
categoryPage: "index.html"
---

## 为什么写这篇测试

这是一篇**自检用**的文章，用来确认 Markdown 转换脚本与文章模板的配合是否完整。
如果下面每个区块都显示正常，说明写作链路工作良好。

需要重点确认的元素有：

- 各级标题的层级与字号
- 有序 / 无序 / 嵌套列表
- 表格、引用、分割线
- 行内代码 `inline code` 与多语言代码块高亮

---

## 一、文本与列表

普通段落支持 **加粗**、*斜体*，以及指向 [Trae 官网](https://www.trae.ai/) 的链接。

无序列表（含两层嵌套）：

- 嵌入式方向
    - STM32 / AUTOSAR
    - RTOS 实时性分析
- Web 方向
    - 前端工程化

有序列表：

1. 先在 `md/` 目录写好 Markdown
2. 执行转换脚本生成正文片段
3. 在文章详情页验证渲染

> 引用块用来强调背景或结论。
> 第二行会与第一行同属一个引用段落。
>
> > 还支持嵌套引用。

* * *

## 二、图片

图片建议直接写 `<img>` 标签并指定宽度百分比，点击可放大查看：

<img src="./picture/ssl_certificate_install_record/cover.webp" alt="示例封面" title="点击可放大" width="50%" />

## 三、表格

| 语言       | 典型用途         | 高亮语法名   | 备注               |
| ---------- | ---------------- | ------------ | ------------------ |
| C          | 底层驱动         | `language-c` | 裸机开发主力       |
| C++        | 上位机 / 框架    | `language-cpp` | 注意 fence 写 c++ |
| Bash       | 部署与运维脚本   | `language-bash` | sh/shell 会自动映射 |
| Python     | 工具与数据处理   | `language-python` | 转换脚本本身的语言 |
| Java       | 服务端           | `language-java` | 企业级后端         |
| CSS        | 页面样式         | `language-css` | 本站主题所用       |

## 四、C 语言

```c
#include <stdio.h>
#include <stdint.h>

#define BUFFER_SIZE 16

typedef struct {
    uint8_t  id;
    float    temperature;
} sensor_t;

int main(void) {
    sensor_t sensor = { .id = 1, .temperature = 36.5f };
    /* 打印传感器读数 */
    printf("sensor=%u temp=%.1f\n", sensor.id, sensor.temperature);
    return 0;
}
```

## 五、C++

（这一段故意用 `c++` 作为代码块语言，验证别名会自动归一化为 cpp）

```c++
#include <iostream>
#include <vector>
#include <string>

template <typename T>
class Stack {
public:
    void push(const T& value) { items_.push_back(value); }

    T pop() {
        T top = items_.back();
        items_.pop_back();
        return top;
    }

private:
    std::vector<T> items_;
};

int main() {
    Stack<std::string> stack;
    stack.push("embedded");
    std::cout << stack.pop() << std::endl;
    return 0;
}
```

## 六、Bash

```bash
#!/bin/bash
set -euo pipefail

TARGET_DIR="/var/www/blog"

if [[ ! -d "$TARGET_DIR" ]]; then
    echo "目录不存在: $TARGET_DIR" >&2
    exit 1
fi

for file in "$TARGET_DIR"/*.html; do
    echo "部署 $file"
done

echo "部署完成"
```

## 七、Python

```python
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Article:
    slug: str
    title: str
    tags: list[str]


def load_articles(content_dir: Path) -> list[Article]:
    """读取 content 目录下的所有文章片段。"""
    articles = []
    for path in sorted(content_dir.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        articles.append(Article(slug=path.stem, title=path.stem, tags=[]))
    return articles


if __name__ == "__main__":
    for item in load_articles(Path("articles/content")):
        print(f"{item.slug}: {len(item.tags)} tags")
```

## 八、Java

```java
public class TemperatureReader {

    private static final double OFFSET = 0.5;

    public static double toCelsius(int raw) {
        return raw * 0.0625 - OFFSET;
    }

    public static void main(String[] args) {
        int[] samples = { 320, 336, 352 };
        for (int raw : samples) {
            System.out.printf("raw=%d -> %.2f°C%n", raw, toCelsius(raw));
        }
    }
}
```

## 九、CSS

```css
:root {
    --c-primary: 0 74 198;
    --radius: 0.5rem;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (max-width: 768px) {
    .card {
        border-radius: var(--radius);
    }
}
```

## 十、其他常用语言

JavaScript：

```javascript
const articles = await fetch('/api/articles').then((res) => res.json());
articles.filter((item) => item.tags.includes('embedded')).forEach(console.log);
```

JSON：

```json
{
  "slug": "markdown_syntax_showcase",
  "tags": ["Markdown", "写作"],
  "published": true
}
```

SQL：

```sql
SELECT category, COUNT(*) AS total
FROM articles
WHERE published = 1
GROUP BY category
ORDER BY total DESC;
```

YAML：

```yaml
site:
  name: LogBase
  theme: gray
  nav:
    - 最新文章
    - 关于作者
```