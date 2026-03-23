// 博客通用功能脚本
document.addEventListener('DOMContentLoaded', function () {
    // 搜索功能
    const searchInput = document.querySelector('input[placeholder*="搜索"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }

    // 导航高亮
    setActiveNav();

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

function setActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentDir = window.location.pathname; // 获取完整路径用于判断分类

    const navLinks = document.querySelectorAll('.flex-1.space-y-1 a, nav.hidden.md\\:flex a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let isActive = false;

        // 检查是否是当前页面
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            isActive = true;
        }
        // 特殊处理：当在文章详情页时，根据页面数据属性判断应高亮哪个分类
        else if (document.body.hasAttribute('data-category')) {
            const category = document.body.getAttribute('data-category');
            if ((category.includes('embedded') || category.includes('iot')) &&
                (href.includes('emed.html') || link.textContent.includes('物联网'))) {
                isActive = true;
            }
        }

        if (isActive) {
            link.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300');
            link.classList.remove('text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-slate-100');
        } else {
            link.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300');
        }
    });
}

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