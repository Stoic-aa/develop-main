/**
 * 文章详情页脚本
 * 功能：
 * - 根据 URL 参数 slug 查找并渲染文章详情
 * - 支持深色模式（调用全局 setupDarkModeToggle）
 * - 加载 Markdown/HTML 正文内容
 * - 绑定分享、点赞等交互按钮
 * - 文章不存在时显示友好错误页
 * 
 * 依赖全局：
 * - articlesData (由 articles-data.js 提供)
 * - setActiveNav, setupDarkModeToggle (由 main.js 提供)
 */

// =========================== 辅助函数 ===========================

/**
 * 规范化路径：将反斜线替换为正斜线，合并多个连续斜杠
 * @param {string} path - 原始路径
 * @returns {string} 规范化后的路径
 */
function normalizePath(path) {
    if (!path) return '';
    return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

/**
 * 从当前 URL 的查询参数中获取 slug 值
 * @returns {string} slug（例如 "my-article"）
 */
function getArticleSlugFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('slug') || '').trim();
}

/**
 * 根据文章 URL 计算 slug（优先取查询参数 slug，否则取文件名）
 * @param {string} url - 文章 URL
 * @returns {string}
 */
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

/**
 * 根据 slug 从全局 articlesData 中查找文章对象
 * @param {string} slug
 * @returns {Object|null}
 */
function findArticleBySlug(slug) {
    if (!slug || typeof articlesData === 'undefined' || !Array.isArray(articlesData)) {
        return null;
    }
    return articlesData.find(article => getArticleSlug(article.url) === slug) || null;
}

/**
 * 解析文章正文文件的完整路径
 * @param {string} contentFile - 相对路径（可能以 ./ 或 ../ 开头）
 * @returns {string} 可 fetch 的路径
 * @throws 若 contentFile 缺失则抛出错误
 */
function resolveArticleContentPath(contentFile) {
    if (!contentFile) {
        throw new Error('articles-data.js 中缺少 contentFile 字段');
    }
    // 如果已经是相对路径形式（./ 或 ../），直接返回；否则添加 ./
    if (contentFile.startsWith('./') || contentFile.startsWith('../')) {
        return contentFile;
    }
    return `./${contentFile}`;
}

// =========================== 渲染函数 ===========================

/**
 * 渲染文章标签到指定容器
 * @param {HTMLElement} container - 存放标签的 DOM 元素
 * @param {string[]} tags - 标签数组
 */
function renderTags(container, tags) {
    container.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-surface-container-highest text-slate-600 rounded-full text-xs font-label font-bold tag-item';
        span.textContent = `#${tag}`;
        container.appendChild(span);
    });
}

/**
 * 渲染错误信息到页面（替换文章正文区域，并修改标题）
 * @param {string} message - 错误提示文本
 */
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

/**
 * 核心渲染函数：根据 slug 加载文章数据并填充页面
 * @returns {Promise<void>}
 */
async function renderArticleDetail() {
    const slug = getArticleSlugFromQuery();
    const article = findArticleBySlug(slug);

    if (!slug || !article) {
        renderArticleError('未找到对应文章。');
        return;
    }

    // 更新页面标题
    document.title = `${article.title} | TechEditorial`;

    // 获取 DOM 元素
    const titleEl = document.querySelector('.article-title');
    const categoryEl = document.querySelector('.category-tag');
    const dateEl = document.querySelector('.publish-date');
    const authorEl = document.querySelector('.author-name');
    const authorAvatarEl = document.querySelector('.author-avatar');
    const readTimeEl = document.querySelector('.read-time');
    const lastUpdatedEl = document.querySelector('.last-updated');
    const tagsSectionEl = document.querySelector('.tags-section');
    const contentEl = document.getElementById('article-content');

    // 填充基础元信息
    titleEl.textContent = article.title || '';
    categoryEl.textContent = article.category || '';
    dateEl.textContent = article.date || '';
    authorEl.textContent = article.author || '';
    authorAvatarEl.src = article.authorAvatar || '';
    authorAvatarEl.alt = article.author || '作者头像';
    readTimeEl.textContent = article.readTime || '';
    lastUpdatedEl.textContent = `最后更新: ${article.lastUpdated || article.date || ''}`;

    // 渲染标签
    renderTags(tagsSectionEl, article.tags || []);

    // 加载并注入正文 HTML
    const contentPath = resolveArticleContentPath(article.contentFile);
    const contentHtml = await fetch(contentPath).then(response => {
        if (!response.ok) {
            throw new Error(`正文内容加载失败: ${contentPath}`);
        }
        return response.text();
    });
    contentEl.innerHTML = contentHtml;
}

// =========================== 交互绑定 ===========================

/**
 * 绑定文章页面的交互按钮（分享、点赞）
 * 分享：优先使用 Web Share API，降级为复制链接
 * 点赞：切换图标颜色和填充状态
 */
function bindArticleActionButtons() {
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
                    alert('文章链接已复制到剪贴板');
                }
            } catch (error) {
                // 用户取消分享或复制失败，静默处理
                console.warn('分享操作取消或失败:', error);
            }
        });
    }

    // 点赞按钮
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            this.classList.toggle('text-red-500');
            const icon = this.querySelector('.material-symbols-outlined');
            if (icon) {
                // 切换图标填充状态（未点赞 / 已点赞）
                icon.textContent = this.classList.contains('text-red-500') ? 'favorite' : 'favorite';
            }
        });
    }
}

// =========================== 初始化入口 ===========================

/**
 * 页面 DOM 加载完成后执行初始化
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 检查依赖数据
        if (typeof articlesData === 'undefined') {
            throw new Error('articlesData 未定义，请确保 articles-data.js 已正确加载');
        }

        // 启用深色模式（由 main.js 提供的全局函数）
        if (typeof setupDarkModeToggle === 'function') {
            setupDarkModeToggle();
        }

        // 渲染文章详情
        await renderArticleDetail();

        // 延迟执行导航高亮，确保 DOM 完全注入
        setTimeout(() => {
            if (typeof setActiveNav === 'function') {
                setActiveNav();
            }
        }, 0);

        // 绑定文章页面特有的按钮事件
        bindArticleActionButtons();
    } catch (error) {
        console.error('文章详情页初始化失败:', error);
        renderArticleError('页面初始化失败，请刷新重试。');
    }
});