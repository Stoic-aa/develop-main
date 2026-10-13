/**
 * @file utils.js
 * @description 全站公共路径 / URL 工具函数（供文章列表页与详情页共用）
 * @version 1.0
 */
(function () {
    'use strict';

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

    // 挂在全局，供 article-list.js / ui.js / article-detail.js 共用
    window.normalizePath = normalizePath;
    window.getCurrentSlug = getCurrentSlug;
    window.getArticleSlug = getArticleSlug;

})();
