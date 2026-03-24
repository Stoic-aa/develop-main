// 博客通用功能脚本
document.addEventListener('DOMContentLoaded', function () {
    setupDarkModeToggle();
    initializeArticles();
    setupArticleHoverEffects();
});

// 全局变量
let displayedArticles = [];
let allSortedArticles = [];
let currentPage = 0;
const ARTICLES_PER_PAGE = 5;

function initializeArticles() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    const isHomepage = currentPath.includes('index.html') || currentPath.endsWith('/');

    // 根据页面决定使用哪个数据源
    if (isHomepage && typeof homepageArticlesData !== 'undefined') {
        // 首页使用专门的推荐文章数据
        allSortedArticles = [...homepageArticlesData].sort((a, b) => {
            const dateA = a.date.replace(/[年月]/g, '-').replace('日', '');
            const dateB = b.date.replace(/[年月]/g, '-').replace('日', '');
            return new Date(dateB) - new Date(dateA);
        });
    } else {
        // 其他页面使用全部文章数据
        allSortedArticles = [...articlesData].sort((a, b) => {
            const dateA = a.date.replace(/[年月]/g, '-').replace('日', '');
            const dateB = b.date.replace(/[年月]/g, '-').replace('日', '');
            return new Date(dateB) - new Date(dateA);
        });
    }

    currentPage = 0;
    displayedArticles = [];

    // 显示第一页的文章
    loadInitialArticles();
    setupLoadMoreButton();
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

function renderArticles() {
    // 不同页面使用不同的容器选择器
    const isHomepage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    const blogListContainer = isHomepage
        ? document.querySelector('.space-y-10')  // 首页的选择器
        : document.querySelector('.space-y-16'); // emed.html页面的选择器

    if (!blogListContainer) return;

    // 清空容器，但保留加载按钮
    const loadMoreButton = document.querySelector('.pt-12.flex.justify-center');
    blogListContainer.innerHTML = '';

    // 重新添加文章容器
    const articlesContainer = document.createElement('div');
    // 根据页面设置不同的类名
    articlesContainer.className = isHomepage ? 'space-y-10' : 'space-y-16';

    // 添加文章卡片
    displayedArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesContainer.appendChild(articleCard);
    });

    blogListContainer.appendChild(articlesContainer);

    // 重新添加加载按钮
    if (loadMoreButton) {
        blogListContainer.appendChild(loadMoreButton);

        // 如果没有更多文章可加载，隐藏加载按钮
        const remainingArticles = allSortedArticles.length - displayedArticles.length;
        if (remainingArticles <= 0) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'flex';
        }
    }
}

function loadMoreArticles() {
    const startIndex = currentPage * ARTICLES_PER_PAGE;
    const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, allSortedArticles.length);

    const newArticles = allSortedArticles.slice(startIndex, endIndex);

    if (newArticles.length > 0) {
        displayedArticles = displayedArticles.concat(newArticles);
        currentPage++;

        renderArticles();
    }
}

// 其他函数保持不变...

function performSearch(query) {
    if (query.trim() === '') return;

    console.log('搜索:', query);
    alert(`正在搜索: ${query}`);
}

function normalizePath(path) {
    return (path || '')
        .split('?')[0]
        .split('#')[0]
        .trim()
        .split('/')
        .filter(Boolean)
        .pop() || '';
}

function getCurrentSlug() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('slug') || '').trim();
}

function getArticleSlug(url) {
    if (!url) return '';

    try {
        const fakeUrl = new URL(url, window.location.origin);
        const querySlug = fakeUrl.searchParams.get('slug');
        if (querySlug) return querySlug.trim();

        const fileName = normalizePath(fakeUrl.pathname);
        return fileName.replace('.html', '').trim();
    } catch (error) {
        const pureUrl = url.split('?')[0];
        const fileName = normalizePath(pureUrl);
        return fileName.replace('.html', '').trim();
    }
}

function setActiveNav() {
    const fullPath = window.location.pathname;
    const fileName = normalizePath(fullPath); // 移除默认值 'index.html'
    const currentSlug = getCurrentSlug();
    const navLinks = document.querySelectorAll('.flex-1.space-y-1 a');

    navLinks.forEach(link => {
        link.classList.remove(
            'bg-blue-50',
            'dark:bg-blue-900/20',
            'text-blue-700',
            'dark:text-blue-300',
            'rounded-lg'
        );

        link.classList.add(
            'text-slate-500',
            'dark:text-slate-400',
            'hover:text-slate-900',
            'dark:hover:text-slate-900'
        );

        const linkHref = normalizePath(link.getAttribute('href'));

        // 直接比较标准化后的路径
        let isMatch = (linkHref === fileName);

        // 如果直接匹配失败，尝试其他匹配方式
        if (!isMatch) {
            // 检查原始href是否匹配（包括.html扩展名）
            const originalHref = link.getAttribute('href');
            if (originalHref && (fullPath.includes(originalHref) ||
                normalizePath(fullPath + '.html') === normalizePath(originalHref))) {
                isMatch = true;
            }
        }

        if (!isMatch && typeof articlesData !== 'undefined' && Array.isArray(articlesData)) {
            const currentArticle = articlesData.find(article => {
                const articlePathName = normalizePath(article.url);
                const articleSlug = getArticleSlug(article.url);

                if (currentSlug) {
                    return articleSlug === currentSlug;
                }

                return articlePathName === fileName;
            });

            if (currentArticle && normalizePath(currentArticle.categoryPage) === linkHref) {
                isMatch = true;
            }
        }

        if (isMatch) {
            link.classList.remove(
                'text-slate-500',
                'dark:text-slate-400',
                'hover:text-slate-900',
                'dark:hover:text-slate-900'
            );

            link.classList.add(
                'bg-blue-50',
                'dark:bg-blue-900/20',
                'text-blue-700',
                'dark:text-blue-300',
                'rounded-lg'
            );
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);

function setupDarkModeToggle() {
    const storedTheme = localStorage.getItem('theme');

    if (
        storedTheme === 'dark' ||
        (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });
}

// 创建文章卡片
function createArticleCard(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'group cursor-pointer';
    articleDiv.dataset.articleUrl = article.url;

    articleDiv.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-8 space-y-4">
                <div class="flex items-center gap-3 text-xs font-label text-primary font-bold tracking-widest uppercase">
                    <span>${article.category}</span>
                    <span class="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span class="text-on-surface-variant font-medium">${article.date}</span>
                </div>
                <h2 class="text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors duration-300 article-title-hover">
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

    articleDiv.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
            return;
        }

        window.location.href = article.url;
    });

    return articleDiv;
}

function setupArticleHoverEffects() {
    const articleCards = document.querySelectorAll('article.group');
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const title = this.querySelector('.article-title-hover');
            if (title) {
                title.style.transform = 'translateY(-4px) scale(1.02)';
            }
        });

        card.addEventListener('mouseleave', function () {
            const title = this.querySelector('.article-title-hover');
            if (title) {
                title.style.transform = '';
            }
        });
    });
}