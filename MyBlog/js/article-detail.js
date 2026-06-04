// 确保在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // 检查 articlesData 是否存在
        if (typeof articlesData === 'undefined') {
            throw new Error('articlesData 未定义，请确保 articles-data.js 已正确加载');
        }

        setupDarkModeToggle();
        await renderArticleDetail();

        setTimeout(() => {
            if (typeof setActiveNav === 'function') {
                setActiveNav();
            }
        }, 0);

        bindArticleActionButtons();
    } catch (error) {
        console.error('文章详情页初始化失败:', error);
        renderArticleError('页面初始化失败，请刷新重试。');
    }
});

async function renderArticleDetail() {
    const slug = getArticleSlugFromQuery();
    const article = findArticleBySlug(slug);

    if (!slug || !article) {
        renderArticleError('未找到对应文章。');
        return;
    }

    document.title = `${article.title} | TechEditorial`;

    const titleEl = document.querySelector('.article-title');
    const categoryEl = document.querySelector('.category-tag');
    const dateEl = document.querySelector('.publish-date');
    const authorEl = document.querySelector('.author-name');
    const authorAvatarEl = document.querySelector('.author-avatar');
    const readTimeEl = document.querySelector('.read-time');
    const lastUpdatedEl = document.querySelector('.last-updated');
    const tagsSectionEl = document.querySelector('.tags-section');
    const contentEl = document.getElementById('article-content');

    titleEl.textContent = article.title || '';
    categoryEl.textContent = article.category || '';
    dateEl.textContent = article.date || '';
    authorEl.textContent = article.author || '';
    authorAvatarEl.src = article.authorAvatar || '';
    authorAvatarEl.alt = article.author || '作者头像';
    readTimeEl.textContent = article.readTime || '';
    lastUpdatedEl.textContent = `最后更新: ${article.lastUpdated || article.date || ''}`;

    renderTags(tagsSectionEl, article.tags || []);

    const contentPath = resolveArticleContentPath(article.contentFile);
    const contentHtml = await fetch(contentPath).then(response => {
        if (!response.ok) {
            throw new Error(`正文内容加载失败: ${contentPath}`);
        }
        return response.text();
    });

    contentEl.innerHTML = contentHtml;
}

function renderTags(container, tags) {
    container.innerHTML = '';

    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item';
        span.textContent = `#${tag}`;
        container.appendChild(span);
    });
}

function resolveArticleContentPath(contentFile) {
    if (!contentFile) {
        throw new Error('articles-data.js 中缺少 contentFile 字段');
    }

    if (contentFile.startsWith('./') || contentFile.startsWith('../')) {
        return contentFile;
    }

    return `./${contentFile}`;
}

function getArticleSlugFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('slug') || '').trim();
}

function findArticleBySlug(slug) {
    if (!slug || typeof articlesData === 'undefined' || !Array.isArray(articlesData)) {
        return null;
    }

    return articlesData.find(article => getArticleSlug(article.url) === slug) || null;
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

function renderArticleError(message) {
    const contentEl = document.getElementById('article-content');
    const titleEl = document.querySelector('.article-title');

    if (titleEl) {
        titleEl.textContent = '文章不存在';
    }

    if (contentEl) {
        contentEl.innerHTML = `
            <div class="rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
                <p class="text-on-surface">${message}</p>
                <a href="../index.html" class="inline-flex mt-4 text-primary font-semibold hover:underline">
                    返回首页
                </a>
            </div>
        `;
    }
}

function bindArticleActionButtons() {
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async function () {
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
                    alert('文章链接已复制到剪贴板');
                }
            } catch (error) {
                console.warn('分享操作取消或失败:', error);
            }
        });
    }

    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            this.classList.toggle('text-red-500');
            const icon = this.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = this.classList.contains('text-red-500') ? 'favorite' : 'favorite';
            }
        });
    }
}

// 辅助函数：规范化路径
function normalizePath(path) {
    if (!path) return '';
    return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}