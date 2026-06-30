/**
 * @file main.js
 * @description 全站通用交互逻辑：文章渲染/分页、深色模式、移动端侧边栏、导航高亮、搜索实现
 * @listen layout:ready 布局就绪事件，保证组件加载完成后再执行业务逻辑
 * @version 1.1
 */
(function () {
    'use strict';

    // ====================== 常量配置 ======================
    const ARTICLE_PER_PAGE = 5;
    const ARTICLE_CARD_SCALE = 0.8; // 文章卡片整体缩放系数 (1 = 100%, 0.95 = 95%)
    const GLOBAL_FLAGS = {
        mobileSidebarBound: '__mobile_sidebar_bound',
        articleHoverBound: '__article_hover_bound'
    };

    // ====================== 全局状态（仅本模块使用） ======================
    let displayedArticles = [];
    let allSortedArticles = [];
    let currentPage = 0;

    // ====================== 公共工具函数（全局复用，避免多文件重复） ======================
    /**
     * 标准化日期：中文日期转 YYYY-MM-DD
     * @param {string} dateStr 例：2024年5月24日
     * @returns {string}
     */
    function normalizeChineseDate(dateStr) {
        return (dateStr || '').replace(/[年月]/g, '-').replace('日', '');
    }

    /**
     * 标准化URL路径（统一斜杠、截取文件名）
     * @param {string} path 路径/URL
     * @returns {string}
     */
    function normalizePath(path) {
        if (!path) return '';
        const purePath = path.split('?')[0].split('#')[0].trim();
        const formatted = purePath.replace(/\\/g, '/').replace(/\/+/g, '/');
        if (formatted === '/' || formatted === '/index.html') return 'index.html';
        return formatted.split('/').filter(Boolean).pop() || '';
    }

    /**
     * 从URL获取 slug 参数
     * @returns {string}
     */
    function getCurrentSlug() {
        const params = new URLSearchParams(window.location.search);
        return (params.get('slug') || '').trim();
    }

    /**
     * 从文章URL解析 slug
     * @param {string} url
     * @returns {string}
     */
    function getArticleSlug(url) {
        if (!url) return '';
        try {
            const fakeUrl = new URL(url, window.location.origin);
            const querySlug = fakeUrl.searchParams.get('slug');
            if (querySlug) return querySlug.trim();
            return normalizePath(fakeUrl.pathname).replace('.html', '');
        } catch {
            return normalizePath(url).replace('.html', '');
        }
    }

    // 挂载全局工具API（供详情页/布局页共用）
    window.normalizePath = normalizePath;
    window.getCurrentSlug = getCurrentSlug;
    window.getArticleSlug = getArticleSlug;

    // ====================== 内部辅助函数 ======================
    /**
     * 判断当前是否为首页
     * @returns {boolean}
     */
    function isHomePage() {
        const path = window.location.pathname;
        // return path.endsWith('/') || path.includes('index.html');
        return false; // 这样所有页面都会按照分类页的逻辑渲染
    }

    /**
     * 获取文章列表容器选择器
     * @returns {Element|null}
     */
    function getArticleListContainer() {
        const selector = isHomePage() ? '.space-y-10' : '.space-y-16';
        return document.querySelector(selector);
    }

    /**
     * 文章数组按日期倒序排序
     * @param {Array} list
     * @returns {Array}
     */
    function sortArticlesByDate(list) {
        return [...list].sort((a, b) => {
            const dA = new Date(normalizeChineseDate(a.date));
            const dB = new Date(normalizeChineseDate(b.date));
            return dB - dA;
        });
    }

    // ====================== 文章卡片渲染 ======================
    /**
     * 创建单篇文章DOM节点
     * @param {Object} article
     * @returns {HTMLElement}
     */
    function createArticleCard(article) {
        const articleEl = document.createElement('article');
        articleEl.className = 'group cursor-pointer';
        articleEl.dataset.articleUrl = article.url;

        // 添加整体缩放效果
        if (ARTICLE_CARD_SCALE !== 1) {
            articleEl.style.transform = `scale(${ARTICLE_CARD_SCALE})`;
            articleEl.style.transformOrigin = 'top left';
            // 缩放后需要调整margin来补偿间距
            // const scaleDiff = (1 - ARTICLE_CARD_SCALE) * 50;
            // articleEl.style.marginBottom = `-${scaleDiff}px`;
            articleEl.style.marginBottom = '-8px'; // 固定减少8px间距
        }

        articleEl.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div class="md:col-span-8 space-y-4">
                <div class="flex items-center gap-3 text-xs font-label text-primary font-bold tracking-widest uppercase">
                    <span>${article.category}</span>
                    <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span class="text-on-surface-variant font-medium">${article.date}</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-300 article-title-hover">
                    ${article.title}
                </h2>
                <p class="text-on-surface-variant leading-relaxed line-clamp-3 font-body">${article.summary}</p>
                <div class="flex items-center gap-4 pt-2">
                    <div class="flex items-center gap-2">
                        <img class="w-6 h-6 rounded-full" alt="作者头像" src="${article.authorAvatar}" />
                        <span class="text-xs font-medium text-on-surface">${article.author}</span>
                    </div>
                    <span class="text-xs text-outline font-label">${article.readTime}</span>
                </div>
            </div>
            <div class="md:col-span-4 aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                <img alt="${article.title} 封面" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${article.coverImage}" />
            </div>
        </div>`;

        // 卡片点击跳转
        articleEl.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            window.location.href = article.url;
        });

        return articleEl;
    }

    /**
     * 渲染全部已加载文章
     */
    function renderArticleList() {
        const container = getArticleListContainer();
        if (!container) return;

        const loadMoreBtn = document.querySelector('.pt-12.flex.justify-center');
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = isHomePage() ? 'space-y-10' : 'space-y-0';
        displayedArticles.forEach(art => wrapper.appendChild(createArticleCard(art)));
        container.appendChild(wrapper);

        // 控制加载更多按钮显隐
        if (loadMoreBtn) {
            container.appendChild(loadMoreBtn);
            const remain = allSortedArticles.length - displayedArticles.length;
            loadMoreBtn.style.display = remain > 0 ? 'flex' : 'none';
        }
    }

    /**
     * 加载下一页文章
     */
    function loadMoreArticle() {
        const start = currentPage * ARTICLE_PER_PAGE;
        const end = Math.min(start + ARTICLE_PER_PAGE, allSortedArticles.length);
        const newList = allSortedArticles.slice(start, end);

        if (newList.length) {
            displayedArticles = displayedArticles.concat(newList);
            currentPage += 1;
            renderArticleList();
        }
    }

    /**
     * 初始化首页特色文章渲染
     */
    function renderFeaturedArticle() {
        const section = document.getElementById('featured-article-section');
        if (!section || !window.featuredArticleData) return;
        const art = window.featuredArticleData;
        const label = window.featuredArticleConfig?.categoryLabel || art.category;

        section.innerHTML = `
        <div class="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-lowest">
            <div class="aspect-[16/9] w-full overflow-hidden">
                <img alt="${art.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${art.coverImage}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div class="absolute bottom-0 p-5 sm:p-8 w-full">
                <span class="inline-block px-3 py-1 bg-primary text-white text-[10px] font-label font-bold tracking-widest uppercase mb-4 rounded-full">
                    ${label}
                </span>
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white mb-4 leading-tight">${art.title}</h1>
                <p class="text-slate-200 font-body text-sm max-w-xl line-clamp-2">${art.summary}</p>
            </div>
        </div>`;
    }

    /**
     * 初始化文章数据 & 首屏渲染
     */
    function initArticleData() {
        if (isHomePage()) renderFeaturedArticle();

        let source = [];
        if (isHomePage() && window.homepageArticlesData) {
            source = window.homepageArticlesData;
        } else if (window.articlesData) {
            source = window.articlesData;
        }

        allSortedArticles = sortArticlesByDate(source);
        currentPage = 0;
        displayedArticles = allSortedArticles.slice(0, ARTICLE_PER_PAGE);
        currentPage = 1;
        renderArticleList();

        // 绑定加载更多按钮（精准选择器）
        const moreBtn = document.querySelector('.pt-12.flex.justify-center button');
        if (moreBtn) {
            moreBtn.addEventListener('click', loadMoreArticle);
            console.log('按钮绑定成功');
        } else {
            console.warn('未找到按钮');
        }
    }

    // ====================== 交互功能：悬停/深色模式/移动端侧边栏 ======================
    /**
     * 文章标题悬浮动效
     */
    function bindArticleHover() {
        if (window[GLOBAL_FLAGS.articleHoverBound]) return;
        window[GLOBAL_FLAGS.articleHoverBound] = true;

        document.querySelectorAll('article.group').forEach(card => {
            const title = card.querySelector('.article-title-hover');
            if (!title) return;
            card.addEventListener('mouseenter', () => title.style.transform = 'translateY(-4px) scale(1.02)');
            card.addEventListener('mouseleave', () => title.style.transform = '');
        });
    }

    /**
     * 深色模式切换（系统偏好 + 本地存储）
     */
    function setupDarkModeToggle() {
        const storedTheme = localStorage.getItem('theme');
        const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme === 'dark' || (!storedTheme && preferDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                e.matches
                    ? document.documentElement.classList.add('dark')
                    : document.documentElement.classList.remove('dark');
            }
        });
    }
    // 暴露给详情页使用
    window.setupDarkModeToggle = setupDarkModeToggle;

    /**
     * 移动端侧边栏（带DOM重试）
     * @param {number} retry 重试次数
     */
    function setupMobileSidebar(retry = 20) {
        if (window[GLOBAL_FLAGS.mobileSidebarBound]) return;

        const menuBtn = document.getElementById('mobile-menu-button');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        const sidebar = document.getElementById('mobile-sidebar');

        if (!menuBtn || !overlay || !sidebar) {
            if (retry > 0) {
                setTimeout(() => setupMobileSidebar(retry - 1), 150);
            }
            return;
        }

        const lgMedia = window.matchMedia('(min-width: 1024px)');
        const isMobile = () => !lgMedia.matches;
        const getEditFAB = () => Array.from(document.querySelectorAll('button.lg\\:hidden'))
            .filter(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                return icon && icon.textContent.trim() === 'edit';
            });

        const openSidebar = () => {
            if (!isMobile()) return;
            overlay.classList.remove('hidden');
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            document.body.classList.add('overflow-hidden');
            getEditFAB().forEach(btn => btn.style.pointerEvents = 'none');
        };

        const closeSidebar = () => {
            if (!isMobile()) return;
            overlay.classList.add('hidden');
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            document.body.classList.remove('overflow-hidden');
            getEditFAB().forEach(btn => btn.style.pointerEvents = 'auto');
        };

        window[GLOBAL_FLAGS.mobileSidebarBound] = true;
        menuBtn.addEventListener('click', openSidebar);
        overlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', e => e.key === 'Escape' && closeSidebar());
        sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSidebar));
        getEditFAB().forEach(btn => btn.addEventListener('click', () => {
            overlay.classList.contains('hidden') ? openSidebar() : closeSidebar();
        }));
    }

    // ====================== 全局对外API（供 layout-init 调用） ======================
    /**
     * 导航栏高亮匹配
     */
    window.setActiveNav = function setActiveNav() {
        const fullPath = window.location.pathname;
        const fileName = normalizePath(fullPath);
        const currentSlug = getCurrentSlug();
        const navLinks = document.querySelectorAll('.flex-1.space-y-1 a');

        const baseCls = ['text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-slate-900'];
        const activeCls = ['bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300', 'rounded-lg'];

        navLinks.forEach(link => {
            link.classList.remove(...activeCls);
            link.classList.add(...baseCls);
            const linkHref = normalizePath(link.getAttribute('href'));
            let isMatch = false;

            // 1. 首页分支：首页 + 首页下所有文章，都高亮首页导航
            if (linkHref === 'index.html' || linkHref === '') {
                // 根路径 / 、index.html、以及无专属分类的文章，都归属首页分支
                isMatch = fullPath === '/' || fileName === 'index.html';
                // 额外兼容：文章详情归属首页分支
                if (!isMatch && window.articlesData) {
                    const currArt = window.articlesData.find(art => {
                        const artSlug = getArticleSlug(art.url);
                        const artFile = normalizePath(art.url);
                        return currentSlug ? artSlug === currentSlug : artFile === fileName;
                    });
                    // 文章未指定分类页 → 属于首页分支
                    if (currArt && (!currArt.categoryPage || normalizePath(currArt.categoryPage) === '' || normalizePath(currArt.categoryPage) === 'index.html')) {
                        isMatch = true;
                    }
                }
            }
            // 2. 其他分类分支（emed.html 等）：当前页面/文章属于该分类则高亮
            else {
                // 精确命中分类页本身
                if (fileName === linkHref) {
                    isMatch = true;
                }
                // 命中该分类下的所有文章
                if (!isMatch && window.articlesData) {
                    const currArt = window.articlesData.find(art => {
                        const artSlug = getArticleSlug(art.url);
                        const artFile = normalizePath(art.url);
                        return currentSlug ? artSlug === currentSlug : artFile === fileName;
                    });
                    if (currArt && normalizePath(currArt.categoryPage) === linkHref) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch) {
                link.classList.remove(...baseCls);
                link.classList.add(...activeCls);
            }
        });
    };

    /**
     * 全局搜索实现
     * @param {string} query 搜索关键词
     */
    window.performSearch = function performSearch(query) {
        const val = query.trim();
        if (!val) return;
        console.log('搜索关键词：', val);
        alert(`正在搜索：${val}`);
    };

    // ====================== 入口：监听布局就绪事件，保证执行顺序 ======================
    function bootstrap() {
        setupDarkModeToggle();
        initArticleData();
        bindArticleHover();
        setupMobileSidebar();
        window.setActiveNav();
    }

    // 等待布局组件全部加载完成再执行业务
    window.addEventListener('layout:ready', bootstrap);

})();