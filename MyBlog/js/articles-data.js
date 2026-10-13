/**
 * @file articles-data.js
 * @description 全站文章唯一数据源与数据工具（纯数据，不含列表渲染逻辑）
 * @version 2.0 (数据与渲染分离，移除 emed 分类 / 首页特色等不可达代码)
 */
(function () {
    'use strict';

    // ====================== 核心文章数据源 ======================
    const articlesData = [
        {
            id            : 1,
            title         : "SSL站点证书申请及更换记录",
            summary       : "记录自己站点证书过期时，申请和更换证书需要的关键步骤，方便下次证书的重新更换上线",
            category      : "车载嵌入式",
            date          : "2026年8月16日",
            readTime      : "阅读时间 12 分钟",
            author        : "Ethan",
            authorAvatar  : "./picture/author.webp",
            coverImage    : "./articles/picture/ssl_certificate_install_record/cover.webp",
            url           : "articles/article-template.html?slug=ssl_certificate_install_record",
            contentFile   : "articles/content/ssl_certificate_install_record.html",
            categoryPage  : "index.html",
            tags          : ["Rust", "物联网", "嵌入式系统", "微内核"],
            lastUpdated   : "2026年8月16日"
        },
        {
            id            : 2,
            title         : "Markdown 写作与代码高亮测试",
            summary       : "一篇用于验证写作链路的内容样例：涵盖标题、列表、表格、引用、分割线以及 C / C++ / Bash / Python / Java / CSS 等多语言代码块。",
            category      : "写作",
            date          : "2026年10月14日",
            readTime      : "阅读时间 8 分钟",
            author        : "Ethan",
            authorAvatar  : "./picture/author.webp",
            coverImage    : "./articles/picture/image.webp",
            url           : "articles/article-template.html?slug=markdown_syntax_showcase",
            contentFile   : "articles/content/markdown_syntax_showcase.html",
            categoryPage  : "index.html",
            tags          : ["Markdown", "写作", "语法高亮"],
            lastUpdated   : "2026年10月14日"
        }
    ];

    // ====================== 数据工具函数 ======================
    /**
     * [核心] 将 "YYYY年M月D日" 格式的字符串解析为 Date 对象
     */
    function parseDate(dateString) {
        if (!dateString) return new Date(0);
        const parts = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (!parts) return new Date(0);
        return new Date(parts[1], parts[2] - 1, parts[3]);
    }

    /**
     * 按日期降序返回文章数组（结果缓存，避免重复计算）
     * @returns {Array} 一个按日期降序排列的新数组
     */
    function getSortedArticles() {
        if (!window._sortedArticlesCache) {
            window._sortedArticlesCache = [...articlesData].sort((a, b) => parseDate(b.date) - parseDate(a.date));
        }
        return window._sortedArticlesCache;
    }

    // ====================== 侧边栏热门趋势 ======================
    /**
     * 渲染侧边栏热门趋势（依赖 #trending-topics，由布局组件注入）
     */
    function renderTrendingTopics() {
        const container = document.getElementById('trending-topics');
        if (!container) return;

        const trendingItems = [];
        const usedTags = new Set();
        const sortedArticles = getSortedArticles();

        for (const article of sortedArticles) {
            if (trendingItems.length >= 3) break;
            if (!article.tags || article.tags.length === 0) continue;
            const firstUnusedTag = article.tags.find(tag => !usedTags.has(tag));
            if (firstUnusedTag) {
                trendingItems.push({ tag: firstUnusedTag, title: article.title, url: article.url || '#' });
                usedTags.add(firstUnusedTag);
            }
        }

        // 用默认话题补齐到 3 条
        const defaultTopics = [
            { tag: 'Hello',  title: 'hello world!', url: '#' },
            { tag: 'Me',     title: 'again happy',  url: '#' },
            { tag: 'You',    title: 'world for me', url: '#' }
        ];
        while (trendingItems.length < 3) {
            const nextDefault = defaultTopics.find(topic => !usedTags.has(topic.tag));
            if (nextDefault) {
                trendingItems.push(nextDefault);
                usedTags.add(nextDefault.tag);
            } else {
                break;
            }
        }

        container.innerHTML = trendingItems.slice(0, 3).map(item => `
            <a class="block p-3 rounded-xl hover:bg-surface-container-high transition-colors group" href="${item.url}">
                <p class="text-xs text-primary font-bold mb-1">#${item.tag}</p>
                <p class="text-sm font-semibold text-on-surface line-clamp-2">${item.title}</p>
            </a>
        `).join('');
    }

    // ====================== 站点统计 ======================
    /**
     * 更新站点统计：文章总数
     */
    function updateSiteStats() {
        const articleCountEl = document.getElementById('stats-article-count');
        if (articleCountEl) { articleCountEl.textContent = articlesData.length; }
    }

    // ====================== 对外暴露 ======================
    window.articlesData = articlesData;
    window.updateSiteStats = updateSiteStats;

    // 布局组件由 layout-init 注入，layout:ready 在注入完成后派发，此时 #trending-topics 已存在。
    // bootstrap.js 保证本脚本先于 layout-init.js 加载，监听不会错过事件。
    window.addEventListener('layout:ready', renderTrendingTopics);

})();
