tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // 语义色统一走 CSS 变量（见 css/style.css 的 :root / html.dark），
                // 用 rgb(... / <alpha-value>) 以保留 /20 之类的透明度修饰符。
                "primary-fixed-dim": "rgb(var(--c-primary-fixed-dim) / <alpha-value>)",
                "secondary": "rgb(var(--c-secondary) / <alpha-value>)",
                "on-secondary-fixed-variant": "rgb(var(--c-on-secondary-fixed-variant) / <alpha-value>)",
                "on-primary": "rgb(var(--c-on-primary) / <alpha-value>)",
                "on-primary-container": "rgb(var(--c-on-primary-container) / <alpha-value>)",
                "on-primary-fixed": "rgb(var(--c-on-primary-fixed) / <alpha-value>)",
                "secondary-fixed": "rgb(var(--c-secondary-fixed) / <alpha-value>)",
                "surface-dim": "rgb(var(--c-surface-dim) / <alpha-value>)",
                "on-tertiary": "rgb(var(--c-on-tertiary) / <alpha-value>)",
                "surface-container-highest": "rgb(var(--c-surface-container-highest) / <alpha-value>)",
                "outline-variant": "rgb(var(--c-outline-variant) / <alpha-value>)",
                "secondary-fixed-dim": "rgb(var(--c-secondary-fixed-dim) / <alpha-value>)",
                "surface": "rgb(var(--c-surface) / <alpha-value>)",
                "error": "rgb(var(--c-error) / <alpha-value>)",
                "inverse-surface": "rgb(var(--c-inverse-surface) / <alpha-value>)",
                "error-container": "rgb(var(--c-error-container) / <alpha-value>)",
                "tertiary-fixed-dim": "rgb(var(--c-tertiary-fixed-dim) / <alpha-value>)",
                "surface-bright": "rgb(var(--c-surface-bright) / <alpha-value>)",
                "on-secondary-container": "rgb(var(--c-on-secondary-container) / <alpha-value>)",
                "surface-container-low": "rgb(var(--c-surface-container-low) / <alpha-value>)",
                "on-secondary-fixed": "rgb(var(--c-on-secondary-fixed) / <alpha-value>)",
                "primary-container": "rgb(var(--c-primary-container) / <alpha-value>)",
                "on-primary-fixed-variant": "rgb(var(--c-on-primary-fixed-variant) / <alpha-value>)",
                "tertiary": "rgb(var(--c-tertiary) / <alpha-value>)",
                "surface-container": "rgb(var(--c-surface-container) / <alpha-value>)",
                "tertiary-container": "rgb(var(--c-tertiary-container) / <alpha-value>)",
                "on-tertiary-container": "rgb(var(--c-on-tertiary-container) / <alpha-value>)",
                "surface-container-high": "rgb(var(--c-surface-container-high) / <alpha-value>)",
                "primary-fixed": "rgb(var(--c-primary-fixed) / <alpha-value>)",
                "on-surface": "rgb(var(--c-on-surface) / <alpha-value>)",
                "outline": "rgb(var(--c-outline) / <alpha-value>)",
                "on-tertiary-fixed-variant": "rgb(var(--c-on-tertiary-fixed-variant) / <alpha-value>)",
                "inverse-primary": "rgb(var(--c-inverse-primary) / <alpha-value>)",
                "on-error-container": "rgb(var(--c-on-error-container) / <alpha-value>)",
                "primary": "rgb(var(--c-primary) / <alpha-value>)",
                "surface-tint": "rgb(var(--c-surface-tint) / <alpha-value>)",
                "on-error": "rgb(var(--c-on-error) / <alpha-value>)",
                "tertiary-fixed": "rgb(var(--c-tertiary-fixed) / <alpha-value>)",
                "background": "rgb(var(--c-background) / <alpha-value>)",
                "on-secondary": "rgb(var(--c-on-secondary) / <alpha-value>)",
                "inverse-on-surface": "rgb(var(--c-inverse-on-surface) / <alpha-value>)",
                "on-tertiary-fixed": "rgb(var(--c-on-tertiary-fixed) / <alpha-value>)",
                "on-background": "rgb(var(--c-on-background) / <alpha-value>)",
                "surface-variant": "rgb(var(--c-surface-variant) / <alpha-value>)",
                "surface-container-lowest": "rgb(var(--c-surface-container-lowest) / <alpha-value>)",
                "secondary-container": "rgb(var(--c-secondary-container) / <alpha-value>)",
                "on-surface-variant": "rgb(var(--c-on-surface-variant) / <alpha-value>)"
            },
            fontFamily: {
                "headline": ["Space Grotesk", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                "body": ["Manrope", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                "label": ["Inter", "PingFang SC", "Microsoft YaHei", "sans-serif"],
                "mono": ["Fira Code", "ui-monospace", "SFMono-Regular"]
            },
            borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
            // 移动端整页按 50% 缩放展示（viewport initial-scale=0.5），手机的布局视口被放大到约 780px，
            // 会误触发默认的 sm(640px) / md(768px) 断点，导致手机出现桌面端布局。
            // 这里把这两个断点上移到 1024px（与 lg 对齐），保证手机仍使用移动端布局，桌面端（≥1024px）行为不变。
            screens: { "sm": "1024px", "md": "1024px" },
        },
    },
}
