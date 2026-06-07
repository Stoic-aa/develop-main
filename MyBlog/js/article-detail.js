/**
 * @file article-detail.js
 * @description 文章详情页专属逻辑：文章查找、正文加载、元信息渲染、分享/点赞交互
 * @depend 依赖全局：articlesData / normalizePath / getArticleSlug / setupDarkModeToggle / setActiveNav
 * @version 1.1
 */
(function () {
    'use strict';

    // ====================== 辅助函数 ======================
    /**
     * 从URL参数获取文章slug
     * @returns {string}
     */
    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return (params.get('slug') || '').trim();
    }

    /**
     * 根据slug查找文章对象
     * @param {string} slug
     * @returns {Object|null}
     */
    function findArticleBySlug(slug) {
        if (!slug || !Array.isArray(window.articlesData)) return null;
        return window.articlesData.find(art => window.getArticleSlug(art.url) === slug) || null;
    }

    /**
     * 解析正文内容文件路径
     * @param {string} contentFile
     * @returns {string}
     * @throws {Error}
     */
    function resolveContentPath(contentFile) {
        if (!contentFile) throw new Error('缺少正文文件配置 contentFile');
        if (contentFile.startsWith('./') || contentFile.startsWith('../')) {
            return contentFile;
        }
        return `./${contentFile}`;
    }

    // ====================== 渲染函数 ======================
    /**
     * 渲染标签列表
     * @param {HTMLElement} container
     * @param {string[]} tags
     */
    function renderTagList(container, tags) {
        container.innerHTML = '';
        (tags || []).forEach(tag => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item';
            span.textContent = `#${tag}`;
            container.appendChild(span);
        });
    }

    /**
     * 渲染错误提示页面
     * @param {string} msg 错误信息
     */
    function renderErrorPage(msg) {
        const titleEl = document.querySelector('.article-title');
        const contentEl = document.getElementById('article-content');

        titleEl && (titleEl.textContent = '文章不存在');
        if (contentEl) {
            contentEl.innerHTML = `
            <div class="rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
                <p class="text-on-surface">${msg}</p>
                <a href="../index.html" class="inline-flex mt-4 text-primary font-semibold hover:underline">返回首页</a>
            </div>`;
        }
    }

    /**
     * 核心：加载并渲染文章详情
     * @returns {Promise<void>}
     */
    async function renderArticleDetail() {
        const slug = getSlugFromUrl();
        const article = findArticleBySlug(slug);

        if (!slug || !article) {
            renderErrorPage('未找到对应文章。');
            return;
        }

        // 设置页面标题
        document.title = `${article.title} | TechEditorial`;

        // 绑定DOM元素
        const els = {
            title: document.querySelector('.article-title'),
            category: document.querySelector('.category-tag'),
            date: document.querySelector('.publish-date'),
            author: document.querySelector('.author-name'),
            avatar: document.querySelector('.author-avatar'),
            readTime: document.querySelector('.read-time'),
            updateTime: document.querySelector('.last-updated'),
            tagsBox: document.querySelector('.tags-section'),
            content: document.getElementById('article-content')
        };

        // 填充元信息
        els.title && (els.title.textContent = article.title);
        els.category && (els.category.textContent = article.category);
        els.date && (els.date.textContent = article.date);
        els.author && (els.author.textContent = article.author);
        els.avatar && (els.avatar.src = article.authorAvatar || '');
        els.avatar && (els.avatar.alt = article.author || '作者头像');
        els.readTime && (els.readTime.textContent = article.readTime);
        els.updateTime && (els.updateTime.textContent = `最后更新: ${article.lastUpdated || article.date}`);

        // 渲染标签
        renderTagList(els.tagsBox, article.tags);

        // 加载正文HTML
        try {
            const contentPath = resolveContentPath(article.contentFile);
            const res = await fetch(contentPath);
            if (!res.ok) throw new Error('正文加载失败');
            els.content.innerHTML = await res.text();
        } catch (err) {
            console.error('正文加载异常:', err);
            renderErrorPage('文章正文加载失败，请刷新重试。');
        }
    }

    // ====================== 交互绑定 ======================
    /**
     * 绑定分享、点赞按钮
     */
    function bindActionButtons() {
        // 分享按钮
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const shareData = {
                    title: document.title,
                    text: document.querySelector('.article-title')?.textContent || '',
                    url: window.location.href
                };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('链接已复制到剪贴板');
                    }
                } catch (err) {
                    console.warn('分享操作终止:', err.message);
                }
            });
        }

        // 点赞按钮
        const likeBtn = document.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', function () {
                this.classList.toggle('text-red-500');
            });
        }
    }

    // ====================== 页面入口 ======================
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // 校验数据源
            if (typeof window.articlesData === 'undefined') {
                throw new Error('文章数据源未加载，请检查 articles-data.js');
            }

            // 初始化深色模式
            if (typeof window.setupDarkModeToggle === 'function') {
                window.setupDarkModeToggle();
            }

            // 渲染文章
            await renderArticleDetail();

            // 导航高亮
            setTimeout(() => {
                if (typeof window.setActiveNav === 'function') {
                    window.setActiveNav();
                }
            }, 0);

            // 绑定按钮交互
            bindActionButtons();
        } catch (err) {
            console.error('文章详情页初始化失败:', err);
            renderErrorPage('页面初始化异常，请刷新页面。');
        }
    });

})();