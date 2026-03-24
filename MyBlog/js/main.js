// 博客通用功能脚本
document.addEventListener('DOMContentLoaded', function () {

    // 暗黑模式切换
    setupDarkModeToggle();

    // 渲染文章列表
    renderArticles();

    // 文章悬停效果
    setupArticleHoverEffects();
});

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

function setActiveNav() {
    const fullPath = window.location.pathname;
    const fileName = normalizePath(fullPath) || 'index.html';
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
            'dark:hover:text-slate-100'
        );

        const linkHref = normalizePath(link.getAttribute('href'));
        let isMatch = (linkHref === fileName);

        if (!isMatch && !['index.html', 'emed.html', 'web.html', 'ai.html'].includes(fileName)) {
            if (typeof articlesData !== 'undefined' && Array.isArray(articlesData)) {
                const currentArticle = articlesData.find(article => {
                    return normalizePath(article.url) === fileName;
                });

                if (currentArticle && normalizePath(currentArticle.categoryPage) === linkHref) {
                    isMatch = true;
                }
            }
        }

        if (isMatch) {
            link.classList.remove(
                'text-slate-500',
                'dark:text-slate-400',
                'hover:text-slate-900',
                'dark:hover:text-slate-100'
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

    if (storedTheme === 'dark' ||
        (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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

// 渲染文章列表
function renderArticles() {
    // 获取文章列表容器
    const blogListContainer = document.querySelector('.space-y-16'); // 在你的HTML中找到放置文章列表的容器
    if (!blogListContainer) return;

    // 清空现有内容
    blogListContainer.innerHTML = '';

    // 添加特色文章部分
    const featuredSection = document.createElement('div');
    featuredSection.className = 'space-y-16';
    blogListContainer.appendChild(featuredSection);

    // 循环渲染文章
    articlesData.forEach(article => {
        const articleCard = createArticleCard(article);
        featuredSection.appendChild(articleCard);
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

    // 添加点击事件
    articleDiv.addEventListener('click', function (e) {
        // 如果点击的是链接或其他交互元素，则不触发文章跳转
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
            return;
        }

        // 跳转到文章详情页
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