/**
 * @file article-detail.js
 * @description 文章详情页专属逻辑：文章查找、正文加载、元信息渲染、分享/点赞交互
 * @depend 依赖全局：articlesData / getArticleSlug / setupDarkModeToggle / setActiveNav
 * @version 2.0 (重构为模块化对象)
 */
(function () {
    'use strict';

    // ====================== 主对象：封装页面逻辑 ======================
    const ArticleDetailPage = {
        // 缓存DOM元素
        elements: {},
        // 页面状态
        state: {
            slug: null,
            article: null
        },

        /**
         * 页面初始化入口
         */
        init: async function () {
            try {
                // 0. 校验全局依赖
                if (typeof window.articlesData === 'undefined') {
                    throw new Error('文章数据源未加载，请检查 articles-data.js');
                }

                // 1. 缓存DOM元素
                this.cacheElements();

                // 2. 初始化数据（获取slug和文章对象）
                this.initData();

                // 3. 根据数据渲染页面
                if (!this.state.article) {
                    this.renderError('未找到对应文章。');
                    return;
                }
                
                await this.render();

                // 4. 绑定所有交互事件
                this.bindEvents();

                // 5. 初始化外部依赖功能
                this.initGlobalScripts();

            } catch (err) {
                console.error('文章详情页初始化失败:', err);
                this.renderError('页面初始化异常，请刷新页面。');
            }
        },

        /**
         * 缓存页面需要操作的DOM元素
         */
        cacheElements: function () {
            this.elements = {
                title      : document.querySelector('.article-title'),
                category   : document.querySelector('.category-tag'),
                date       : document.querySelector('.publish-date'),
                author     : document.querySelector('.author-name'),
                avatar     : document.querySelector('.author-avatar'),
                readTime   : document.querySelector('.read-time'),
                updateTime : document.querySelector('.last-updated'),
                tagsBox    : document.querySelector('.tags-section'),
                content    : document.getElementById('article-content'),
                imageModal : document.getElementById('image-modal'),
                modalImage : document.getElementById('modal-image'),
                modalClose : document.getElementById('modal-close'),
                shareBtn   : document.querySelector('.share-btn'),
                likeBtn    : document.querySelector('.like-btn')
            };
        },

        /**
         * 初始化数据，从URL获取slug并查找文章
         */
        initData: function () {
            const params = new URLSearchParams(window.location.search);
            this.state.slug = (params.get('slug') || '').trim();
            
            if (this.state.slug && Array.isArray(window.articlesData)) {
                this.state.article = window.articlesData.find(art => window.getArticleSlug(art.url) === this.state.slug) || null;
            }
        },

        /**
         * 主渲染函数，调度各个子渲染模块
         */
        render: async function () {
            const article = this.state.article;
            document.title = `${article.title} | TechEditorial`;
            
            this.renderMeta(article);
            this.renderTags(article.tags);
            await this.renderContent(article.contentFile);
        },

        /**
         * 渲染文章元信息（标题、作者、日期等）
         * @param {Object} article - 文章对象
         */
        renderMeta: function (article) {
            const els = this.elements;
            els.title && (els.title.textContent = article.title);
            els.category && (els.category.textContent = article.category);
            els.date && (els.date.textContent = article.date);
            els.author && (els.author.textContent = article.author);
            els.avatar && (els.avatar.src = article.authorAvatar || '');
            els.avatar && (els.avatar.alt = article.author || '作者头像');
            els.readTime && (els.readTime.textContent = article.readTime);
            els.updateTime && (els.updateTime.textContent = `最后更新: ${article.lastUpdated || article.date}`);
        },

        /**
         * 渲染标签列表
         * @param {string[]} tags - 标签数组
         */
        renderTags: function (tags) {
            const container = this.elements.tagsBox;
            if (!container) return;
            container.innerHTML = '';
            (tags || []).forEach(tag => {
                const span = document.createElement('span');
                span.className = 'px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item';
                span.textContent = `#${tag}`;
                container.appendChild(span);
            });
        },

        /**
         * 异步加载并渲染文章正文HTML
         * @param {string} contentFile - 正文文件路径
         */
        renderContent: async function (contentFile) {
            if (!this.elements.content) return;
            try {
                const contentPath = this.resolveContentPath(contentFile);
                const res = await fetch(contentPath);
                if (!res.ok) throw new Error(`正文加载失败，状态码: ${res.status}`);
                this.elements.content.innerHTML = await res.text();
            } catch (err) {
                console.error('正文加载异常:', err);
                this.renderError('文章正文加载失败，请刷新重试。');
            }
        },

        /**
         * 渲染错误提示
         * @param {string} msg - 错误信息
         */
        renderError: function (msg) {
            this.elements.title && (this.elements.title.textContent = '文章不存在');
            if (this.elements.content) {
                this.elements.content.innerHTML = `
                <div class="rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
                    <p class="text-on-surface">${msg}</p>
                    <a href="../index.html" class="inline-flex mt-4 text-primary font-semibold hover:underline">返回首页</a>
                </div>`;
            }
        },

        /**
         * 统一绑定所有事件监听
         */
        bindEvents: function () {
            this.bindImageModal();
            this.bindActionButtons();
        },

        /**
         * 绑定图片点击放大功能
         */
        bindImageModal: function () {
            const { content, imageModal, modalImage, modalClose } = this.elements;
            if (!content || !imageModal || !modalImage || !modalClose) return;

            content.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    modalImage.src = e.target.src;
                    imageModal.classList.remove('hidden');
                    imageModal.classList.add('flex');
                }
            });

            const close = () => {
                imageModal.classList.add('hidden');
                imageModal.classList.remove('flex');
                modalImage.src = '';
            };

            modalClose.addEventListener('click', close);
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) close();
            });
        },

        /**
         * 绑定分享和点赞按钮
         */
        bindActionButtons: function () {
            // 分享按钮
            if (this.elements.shareBtn) {
                this.elements.shareBtn.addEventListener('click', async () => {
                    const shareData = {
                        title: document.title,
                        text : this.state.article?.title || '',
                        url  : window.location.href
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
            if (this.elements.likeBtn) {
                this.elements.likeBtn.addEventListener('click', function () {
                    this.classList.toggle('text-red-500');
                });
            }
        },

        /**
         * 初始化依赖的全局脚本
         */
        initGlobalScripts: function() {
            // 初始化深色模式
            if (typeof window.setupDarkModeToggle === 'function') {
                window.setupDarkModeToggle();
            }
            // 设置导航高亮
            setTimeout(() => {
                if (typeof window.setActiveNav === 'function') {
                    window.setActiveNav();
                }
            }, 0);
        },

        /**
         * [辅助函数] 解析正文内容文件路径
         * @param {string} contentFile
         * @returns {string}
         */
        resolveContentPath: function (contentFile) {
            if (!contentFile) throw new Error('缺少正文文件配置 contentFile');
            const currentPagePath = window.location.pathname;
            const pathSegments = currentPagePath.split('/').filter(Boolean);
            let basePath = pathSegments.includes('articles') ? '../' : '';
            return `${basePath}${contentFile}`;
        }
    };

    // ====================== 页面启动入口 ======================
    document.addEventListener('DOMContentLoaded', () => {
        ArticleDetailPage.init();
    });

})();