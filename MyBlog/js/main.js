// ============================================================
// 博客通用功能脚本（优化版）
// 兼容 layout-init.js 中调用的 window.performSearch / window.setActiveNav
// 兼容文章详情页中可能使用的全局变量/函数
// ============================================================

// --------------------------------- 全局变量 -----------------------------
let displayedArticles = [];
let allSortedArticles = [];
let currentPage = 0;
const ARTICLES_PER_PAGE = 5;

// ----------------------------- 内部辅助函数（不暴露到全局） -----------------------------
/**
 * 将中文日期字符串转换为标准日期字符串 YYYY-MM-DD
 * @param {string} dateStr - 如 "2023年12月25日"
 * @returns {string}
 */
function normalizeChineseDate(dateStr) {
    return dateStr.replace(/[年月]/g, '-').replace('日', '');
}

/**
 * 按日期降序排序文章数组
 * @param {Array} articles
 * @returns {Array} 排序后的新数组
 */
function sortArticlesByDateDesc(articles) {
    return [...articles].sort((a, b) => {
        const dateA = normalizeChineseDate(a.date);
        const dateB = normalizeChineseDate(b.date);
        return new Date(dateB) - new Date(dateA);
    });
}

/**
 * 判断当前页面是否为首页（index.html 或根路径）
 * @returns {boolean}
 */
function isHomepage() {
    const path = window.location.pathname;
    return path.includes('index.html') || path.endsWith('/');
}

/**
 * 获取当前页面的文章列表容器元素
 * @returns {Element|null}
 */
function getArticlesContainer() {
    const selector = isHomepage() ? '.space-y-10' : '.space-y-16';
    return document.querySelector(selector);
}

// ----------------------------- 文章卡片渲染（内部使用） -----------------------------
function createArticleCard(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'group cursor-pointer';
    articleDiv.dataset.articleUrl = article.url;

    articleDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div class="md:col-span-8 space-y-4">
                <div class="flex items-center gap-3 text-xs font-label text-primary font-bold tracking-widest uppercase">
                    <span>${article.category}</span>
                    <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span class="text-on-surface-variant font-medium">${article.date}</span>
                </div>
                <h2 class="text-2xl sm:text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-300 article-title-hover">
                    ${article.title}
                </h2>
                <p class="text-on-surface-variant leading-relaxed line-clamp-3 font-body">
                    ${article.summary}
                </p>
                <div class="flex items-center gap-4 pt-2">
                    <div class="flex items-center gap-2">
                        <img class="w-6 h-6 rounded-full" data-alt="Author image"
                            src="${article.authorAvatar}" />
                        <span class="text-xs font-medium text-on-surface">${article.author}</span>
                    </div>
                    <span class="text-xs text-outline font-label">${article.readTime}</span>
                </div>
            </div>
            <div class="md:col-span-4 aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low shadow-sm">
                <img alt="${article.title} 封面" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt="Cover image"
                    src="${article.coverImage}" />
            </div>
        </div>
    `;

    articleDiv.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
            return;
        }
        window.location.href = article.url;
    });

    return articleDiv;
}

function renderArticles() {
    const blogListContainer = getArticlesContainer();
    if (!blogListContainer) return;

    const loadMoreButton = document.querySelector('.pt-12.flex.justify-center');
    blogListContainer.innerHTML = '';

    const articlesContainer = document.createElement('div');
    articlesContainer.className = isHomepage() ? 'space-y-10' : 'space-y-16';

    displayedArticles.forEach(article => {
        articlesContainer.appendChild(createArticleCard(article));
    });

    blogListContainer.appendChild(articlesContainer);

    if (loadMoreButton) {
        blogListContainer.appendChild(loadMoreButton);
        const remainingCount = allSortedArticles.length - displayedArticles.length;
        loadMoreButton.style.display = remainingCount > 0 ? 'flex' : 'none';
    }
}

function loadMoreArticles() {
    const startIndex = currentPage * ARTICLES_PER_PAGE;
    const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, allSortedArticles.length);
    const newArticles = allSortedArticles.slice(startIndex, endIndex);
    if (newArticles.length) {
        displayedArticles = displayedArticles.concat(newArticles);
        currentPage++;
        renderArticles();
    }
}

function loadInitialArticles() {
    const initialArticles = allSortedArticles.slice(0, ARTICLES_PER_PAGE);
    displayedArticles = initialArticles;
    currentPage = 1;
    renderArticles();
}

function setupLoadMoreButton() {
    const loadMoreButton = document.querySelector('button[onclick], button:not([onclick]):not(.article-title-hover):not(.material-symbols-outlined)');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreArticles);
    }
}

// ----------------------------- 特色文章渲染 -----------------------------
function renderFeaturedArticle() {
    const featuredSection = document.getElementById('featured-article-section');
    if (!featuredSection) return;
    const featuredArticle = typeof featuredArticleData !== 'undefined' ? featuredArticleData : null;
    if (featuredArticle) {
        featuredSection.innerHTML = `
            <div class="relative group cursor-pointer overflow-hidden rounded-xl bg-surface-container-lowest">
                <div class="aspect-[16/9] w-full overflow-hidden">
                    <img alt="${featuredArticle.title}"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        data-alt="${featuredArticle.summary}"
                        src="${featuredArticle.coverImage}" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div class="absolute bottom-0 p-5 sm:p-8 w-full">
                    <span class="inline-block px-3 py-1 bg-primary text-white text-[10px] font-label font-bold tracking-widest uppercase mb-4 rounded-full">
                        ${(typeof featuredArticleConfig !== 'undefined' && featuredArticleConfig.categoryLabel) || featuredArticle.category}
                    </span>
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-white mb-4 leading-tight elastic-hover">
                        ${featuredArticle.title}
                    </h1>
                    <p class="text-slate-200 font-body text-sm max-w-xl line-clamp-2">
                        ${featuredArticle.summary}
                    </p>
                </div>
            </div>
        `;
    }
}

// ----------------------------- 文章数据初始化（保留原逻辑） -----------------------------
function initializeArticles() {
    const homepage = isHomepage();
    if (homepage) renderFeaturedArticle();

    let sourceArticles = [];
    if (homepage && typeof homepageArticlesData !== 'undefined') {
        sourceArticles = homepageArticlesData;
    } else if (typeof articlesData !== 'undefined') {
        sourceArticles = articlesData;
    }

    allSortedArticles = sortArticlesByDateDesc(sourceArticles);
    currentPage = 0;
    displayedArticles = [];
    loadInitialArticles();
    setupLoadMoreButton();
}

// ----------------------------- 文章悬停效果（仅初始化时存在的卡片） -----------------------------
function setupArticleHoverEffects() {
    document.querySelectorAll('article.group').forEach(card => {
        const title = card.querySelector('.article-title-hover');
        if (!title) return;
        card.addEventListener('mouseenter', () => title.style.transform = 'translateY(-4px) scale(1.02)');
        card.addEventListener('mouseleave', () => title.style.transform = '');
    });
}

// ----------------------------- 移动端侧边栏 -----------------------------
function setupMobileSidebar(retryLeft = 20) {
    if (window.__mobileSidebarBound) return;

    const menuButton = document.getElementById('mobile-menu-button');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    const sidebar = document.getElementById('mobile-sidebar');

    if (!menuButton || !overlay || !sidebar) {
        if (retryLeft > 0) setTimeout(() => setupMobileSidebar(retryLeft - 1), 150);
        return;
    }

    const lgMedia = window.matchMedia('(min-width: 1024px)');
    const isMobile = () => !lgMedia.matches;
    const getEditFabs = () => Array.from(document.querySelectorAll('button.lg\\:hidden')).filter(btn => {
        const icon = btn.querySelector('span.material-symbols-outlined');
        return icon && (icon.textContent || '').trim() === 'edit';
    });

    const open = () => {
        if (!isMobile()) return;
        overlay.classList.remove('hidden');
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        document.body.classList.add('overflow-hidden');
        getEditFabs().forEach(btn => btn.style.pointerEvents = 'none');
    };

    const close = () => {
        if (!isMobile()) return;
        overlay.classList.add('hidden');
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        document.body.classList.remove('overflow-hidden');
        getEditFabs().forEach(btn => btn.style.pointerEvents = 'auto');
    };

    window.__mobileSidebarBound = true;
    menuButton.addEventListener('click', open);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
    sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    getEditFabs().forEach(btn => btn.addEventListener('click', () => {
        const isOpen = !overlay.classList.contains('hidden');
        isOpen ? close() : open();
    }));
}

// ----------------------------- 深色模式 -----------------------------
function setupDarkModeToggle() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            e.matches ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
        }
    });
}

// ----------------------------- 全局函数（供 layout-init.js / article-detail.js 调用） -----------------------------
window.performSearch = function (query) {
    if (query.trim() === '') return;
    console.log('搜索:', query);
    alert(`正在搜索: ${query}`);
};

window.normalizePath = function (path) {
    if (!path) return '';
    if (path === '/' || path === '/index.html') return 'index.html';
    return (path.split('?')[0].split('#')[0].trim().split('/').filter(Boolean).pop()) || '';
};

window.getCurrentSlug = function () {
    const params = new URLSearchParams(window.location.search);
    return (params.get('slug') || '').trim();
};

window.getArticleSlug = function (url) {
    if (!url) return '';
    try {
        const fakeUrl = new URL(url, window.location.origin);
        const querySlug = fakeUrl.searchParams.get('slug');
        if (querySlug) return querySlug.trim();
        const fileName = window.normalizePath(fakeUrl.pathname);
        return fileName.replace('.html', '').trim();
    } catch (error) {
        const pureUrl = url.split('?')[0];
        const fileName = window.normalizePath(pureUrl);
        return fileName.replace('.html', '').trim();
    }
};

window.setActiveNav = function () {
    const fullPath = window.location.pathname;
    const isRoot = fullPath === '/' || fullPath === '/index.html';
    const fileName = window.normalizePath(fullPath);
    const currentSlug = window.getCurrentSlug();
    const navLinks = document.querySelectorAll('.flex-1.space-y-1 a');
    const baseClasses = ['text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-slate-900'];
    const activeClasses = ['bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300', 'rounded-lg'];

    navLinks.forEach(link => {
        link.classList.remove(...activeClasses);
        link.classList.add(...baseClasses);
        const linkHref = window.normalizePath(link.getAttribute('href'));
        let isMatch = false;

        if (isRoot) {
            if (linkHref === 'index.html' || linkHref === '') isMatch = true;
        } else {
            isMatch = (linkHref === fileName);
            if (!isMatch) {
                const originalHref = link.getAttribute('href');
                if (originalHref && (fullPath.includes(originalHref) ||
                    window.normalizePath(fullPath + '.html') === window.normalizePath(originalHref))) {
                    isMatch = true;
                }
            }
            if (!isMatch && typeof articlesData !== 'undefined' && Array.isArray(articlesData)) {
                const currentArticle = articlesData.find(article => {
                    const articlePathName = window.normalizePath(article.url);
                    const articleSlug = window.getArticleSlug(article.url);
                    if (currentSlug) return articleSlug === currentSlug;
                    return articlePathName === fileName;
                });
                if (currentArticle && window.normalizePath(currentArticle.categoryPage) === linkHref) {
                    isMatch = true;
                }
            }
        }

        if (isMatch) {
            link.classList.remove(...baseClasses);
            link.classList.add(...activeClasses);
        }
    });
};

// ----------------------------- DOMContentLoaded 初始化 -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    setupDarkModeToggle();
    initializeArticles();
    setupArticleHoverEffects();
    setupMobileSidebar();
    window.setActiveNav();   // 确保导航高亮
});