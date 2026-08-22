/**
 * @file articles-data.js
 * @description 全站文章唯一数据源、数据筛选、分类渲染、HTML模板定义
 * @version 1.4 (重构排序逻辑，实现复用)
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
            authorAvatar  : "./picture/author.png",
            coverImage    : "./articles/picture/ssl_certificate_install_record/cover.png",
            url           : "articles/article-template.html?slug=ssl_certificate_install_record",
            contentFile   : "articles/content/ssl_certificate_install_record.html",
            categoryPage  : "index.html",
            tags          : ["Rust", "物联网", "嵌入式系统", "微内核"],
            lastUpdated   : "2026年8月16日"
            // ...其他字段
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
     * [重构] 创建一个可复用的函数，专门用于按日期获取排序后的文章数组
     * @returns {Array} 一个按日期降序排列的新数组
     */
    function getSortedArticles() {
        // 使用 memoization 思想，如果已排序，则直接返回，避免重复计算
        if (!window._sortedArticlesCache) {
            window._sortedArticlesCache = [...articlesData].sort((a, b) => parseDate(b.date) - parseDate(a.date));
        }
        return window._sortedArticlesCache;
    }

    /**
     * [简化] 获取最新N篇文章
     */
    function getLatestArticles(count) {
        return getSortedArticles().slice(0, count);
    }

    /**
     * [简化] 获取全站最新单篇文章
     */
    function getLatestFeaturedArticle() {
        return getSortedArticles()[0] || null;
    }

    /**
     * 生成分类页文章卡片HTML
     */
    function buildEmedArticleCard(article) {
        if (!article) return '';
        const tagHtml = (article.tags || [])
            .map(tag => `<span class="px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item">#${tag}</span>`)
            .join('');
        return `
        <article class="group relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/30 transition-all duration-300">
            <a href="${article.url || '#'}" class="block">
                <div class="aspect-video overflow-hidden">
                    <img src="${article.coverImage || ''}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="p-6 sm:p-8 space-y-4">
                    <div class="flex items-center gap-4 text-sm">
                        <span class="px-3 py-1 bg-primary text-on-primary rounded-full font-label font-bold text-xs tracking-wide">${article.category}</span>
                        <time datetime="${article.date}" class="text-on-surface-variant font-label">${article.date}</time>
                        <span class="text-on-surface-variant font-label">${article.readTime}</span>
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-300">
                        <span class="article-title-hover">${article.title}</span>
                    </h2>
                    <p class="text-lg text-on-surface-variant font-body leading-relaxed">${article.summary}</p>
                    <div class="flex items-center justify-between pt-4">
                        <div class="flex items-center gap-3">
                            <img src="${article.authorAvatar || ''}" alt="${article.author}" class="w-10 h-10 rounded-full">
                            <span class="font-label font-bold text-on-surface">${article.author}</span>
                        </div>
                        <div class="tags-section flex gap-2">${tagHtml}</div>
                    </div>
                </div>
            </a>
        </article>`;
    }

    /**
     * [简化] 渲染 emed.html 分类页面文章列表
     */
    function renderEmedPageArticles() {
        if (!window.location.pathname.includes('emed.html')) return;
        const container = document.querySelector('.space-y-12.sm\\:space-y-16');
        if (!container) return;

        const targetArticles = getSortedArticles().filter(item => item.categoryPage === 'emed.html');

        if (targetArticles.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-12">暂无相关文章</p>';
            return;
        }
        container.innerHTML = targetArticles.map(buildEmedArticleCard).join('');
    }

    /**
     * [简化] 渲染侧边栏热门趋势
     */
    function renderTrendingTopics() {
        const container = document.getElementById('trending-topics');
        if (!container) return;

        const trendingItems = [];
        const usedTags = new Set();
        const sortedArticles = getSortedArticles(); // 直接使用排序好的数组

        for (const article of sortedArticles) {
            if (trendingItems.length >= 3) break;
            if (!article.tags || article.tags.length === 0) continue;
            const firstUnusedTag = article.tags.find(tag => !usedTags.has(tag));
            if (firstUnusedTag) {
                trendingItems.push({ tag: firstUnusedTag, title: article.title, url: article.url || '#' });
                usedTags.add(firstUnusedTag);
            }
        }

        // ... 默认值填充逻辑不变 ...
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

        const topicsHtml = trendingItems.slice(0, 3).map(item => `
            <a class="block p-3 rounded-xl hover:bg-surface-container-high transition-colors group" href="${item.url}">
                <p class="text-xs text-primary font-bold mb-1">#${item.tag}</p>
                <p class="text-sm font-semibold text-on-surface line-clamp-2">${item.title}</p>
            </a>
        `).join('');
        container.innerHTML = topicsHtml;
    }

    // ====================== 对外暴露及执行 ======================
    const homepageArticlesData  = getLatestArticles(4);
    const featuredArticleData   = getLatestFeaturedArticle();
    const featuredArticleConfig = {
        articleId     : featuredArticleData?.id || 0,
        categoryLabel : featuredArticleData?.category || '',
        isFeatured    : true
    };

    window.articlesData = articlesData;
    window.homepageArticlesData  = homepageArticlesData;
    window.featuredArticleData   = featuredArticleData;
    window.featuredArticleConfig = featuredArticleConfig;
    window.renderTrendingTopics  = renderTrendingTopics;

    function updateSiteStats() {
        const articleCountEl = document.getElementById('stats-article-count');
        if (articleCountEl) {articleCountEl.textContent = articlesData.length;}
    }

    window.updateSiteStats = updateSiteStats;
    function initRendering() {
        renderEmedPageArticles();
        setTimeout(renderTrendingTopics, 100);
    }
    
    document.addEventListener('layout:ready', initRendering);

    if (document.readyState !== 'loading') {
        setTimeout(initRendering, 200);
    } else {
        document.addEventListener('DOMContentLoaded', () => {setTimeout(initRendering, 200);});
    }
})();