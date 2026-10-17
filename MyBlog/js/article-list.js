/**
 * @file article-list.js
 * @description 文章列表渲染、分页加载与搜索（依赖全局 articlesData）
 * @listen layout:ready 布局就绪后渲染首屏列表
 * @version 1.0
 */
(function () {
    'use strict';

    // ====================== 常量配置 ======================
    const ARTICLE_PER_PAGE = 5;
    const ARTICLE_CARD_SCALE = 0.8; // 文章卡片整体缩放系数 (1 = 100%, 0.95 = 95%)
    const ARTICLE_HOVER_FLAG = '__article_hover_bound';

    // ====================== 全局状态（仅本模块使用） ======================
    let displayedArticles = [];
    let allSortedArticles = [];
    let currentPage = 0;
    let allArticlesBackup = []; // 保存所有文章的备份，用于搜索

    // ====================== 内部辅助函数 ======================
    /**
     * 标准化中文日期：2024年5月24日 -> 2024-5-24
     * @param {string} dateStr
     * @returns {string}
     */
    function normalizeChineseDate(dateStr) {
        return (dateStr || '').replace(/[年月]/g, '-').replace('日', '');
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

    /**
     * 获取文章列表容器
     * @returns {Element|null}
     */
    function getArticleListContainer() {
        return document.querySelector('.space-y-16');
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

        // 关键：先获取并保存按钮元素，在清空前保存引用
        const loadMoreBtn = document.querySelector('.pt-12.flex.justify-center');

        // 创建新的文章列表容器
        const wrapper = document.createElement('div');
        wrapper.className = 'space-y-0';
        displayedArticles.forEach(art => wrapper.appendChild(createArticleCard(art)));

        // 清空容器并重新添加内容（保留按钮）
        container.innerHTML = '';
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
     * 初始化文章数据 & 首屏渲染
     */
    function initArticleData() {
        // 保存所有文章备份（用于搜索）
        allArticlesBackup = sortArticlesByDate(window.articlesData || []);
        // 当前页面的文章列表
        allSortedArticles = sortArticlesByDate(window.articlesData || []);
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

    // ====================== 全局搜索 ======================
    /**
     * 全局搜索实现
     * @param {string} query 搜索关键词
     */
    window.performSearch = function performSearch(query) {
        const val = query.trim();
        if (!val) {
            // 清空搜索，恢复原列表
            resetArticleList();
            return;
        }

        // 使用所有文章进行搜索（而非当前页面的文章）
        const searchResults = allArticlesBackup.filter(article => {
            const searchable = [
                article.title.toLowerCase(),
                article.summary.toLowerCase(),
                article.category.toLowerCase(),
                ...article.tags.map(tag => tag.toLowerCase())
            ];
            return searchable.some(item => item.includes(val.toLowerCase()));
        });

        // 渲染搜索结果
        renderSearchResults(searchResults, val);
    };

    /**
     * 重置文章列表为初始状态
     */
    function resetArticleList() {
        // 重新初始化数据（关键：恢复到页面初始状态）
        allSortedArticles = sortArticlesByDate(window.articlesData || []);
        currentPage = 1;
        displayedArticles = allSortedArticles.slice(0, ARTICLE_PER_PAGE);
        renderArticleList(); // ← 这里会自动处理按钮显隐

        // 隐藏搜索结果提示
        const searchHint = document.getElementById('search-hint');
        if (searchHint) searchHint.remove();
    }
    // 搜索结果里的「清除搜索」按钮通过内联 onclick 调用，需挂到全局
    window.resetArticleList = resetArticleList;

    /**
     * 渲染搜索结果
     * @param {Array} results 搜索结果数组
     * @param {string} query 搜索关键词
     */
    function renderSearchResults(results, query) {
        const container = getArticleListContainer();
        if (!container) return;

        // 关键：先保存按钮引用
        const loadMoreBtn = document.querySelector('.pt-12.flex.justify-center');

        displayedArticles = results;
        currentPage = 1;

        // 添加搜索提示
        const hintEl = document.createElement('div');
        hintEl.id = 'search-hint';
        hintEl.className = 'mb-6 flex items-center justify-between';
        hintEl.innerHTML = `
        <p class="text-on-surface-variant font-body">
            搜索 "<span class="text-primary font-bold">${query.trim()}</span>" 找到 <span class="text-primary font-bold">${results.length}</span> 篇文章
        </p>
        <button onclick="resetArticleList()" class="text-sm text-primary hover:text-primary/80 font-medium">
            清除搜索
        </button>
    `;

        // 创建结果列表
        const wrapper = document.createElement('div');
        wrapper.className = 'space-y-0';

        if (results.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'text-center py-16';
            emptyEl.innerHTML = `
            <p class="text-on-surface-variant font-body">未找到匹配的文章</p>
            <p class="text-on-surface-variant/70 font-body text-sm mt-2">请尝试其他关键词</p>
        `;
            wrapper.appendChild(emptyEl);
        } else {
            results.forEach(art => wrapper.appendChild(createArticleCard(art)));
        }

        // 清空并重新构建
        container.innerHTML = '';
        container.appendChild(hintEl);
        container.appendChild(wrapper);

        // 添加按钮并隐藏
        if (loadMoreBtn) {
            container.appendChild(loadMoreBtn);
            loadMoreBtn.style.display = 'none';
        }
    }

    // ====================== 交互功能：文章标题悬浮动效 ======================
    /**
     * 文章标题悬浮动效
     */
    function bindArticleHover() {
        if (window[ARTICLE_HOVER_FLAG]) return;
        window[ARTICLE_HOVER_FLAG] = true;

        document.querySelectorAll('article.group').forEach(card => {
            const title = card.querySelector('.article-title-hover');
            if (!title) return;
            card.addEventListener('mouseenter', () => title.style.transform = 'translateY(-4px) scale(1.02)');
            card.addEventListener('mouseleave', () => title.style.transform = '');
        });
    }

    // ====================== 入口：布局就绪后渲染 ======================
    // 文章列表仅存在于带列表容器的页面（首页）；其余页面（如文章阅读页）直接跳过，
    // 避免无谓执行与「未找到按钮」告警
    window.addEventListener('layout:ready', () => {
        if (!getArticleListContainer()) return;
        initArticleData();
        bindArticleHover();
    });

})();
