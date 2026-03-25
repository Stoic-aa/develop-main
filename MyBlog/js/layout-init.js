/**
 * 统一的布局初始化：
 * - 注入 header/sidebar/footer/right-sidebar（若占位符存在）
 * - 绑定搜索输入（Enter -> performSearch）
 * - 注入完成后触发 setActiveNav（若存在）
 * - 派发 window 级事件：`layout:ready`
 *
 * 每个页面只需要在加载时调用：
 *   initLayout({ componentsBasePath: 'components', linkBasePrefix: '' })
 * 或文章页：
 *   initLayout({ componentsBasePath: '../components', linkBasePrefix: '..' })
 */

(function () {
    const DEFAULTS = {
        componentsBasePath: 'components',
        linkBasePrefix: '',
        // 右侧栏组件：有占位符才加载
        rightSidebarPlaceholderSelector: '.right-sidebar-placeholder',
        // 占位符 id
        headerPlaceholderId: 'header-placeholder',
        sidebarPlaceholderId: 'sidebar-placeholder',
        footerPlaceholderId: 'footer-placeholder',
        // 搜索输入：placeholder 包含“搜索”
        searchInputSelector: 'input[placeholder*="搜索"]',
    };

    function isDomReady() {
        return document.readyState === 'interactive' || document.readyState === 'complete';
    }

    function normalizePath(p) {
        return (p || '').replace(/\\/g, '/').replace(/\/+$/g, '');
    }

    function patchRelativeLinks(html, basePrefix) {
        if (!basePrefix) return html;
        // 跳过绝对 URL、#、/ 开头的站内绝对路径、以及 mailto/tel/javascript
        return html.replace(
            /(href|src)=["'](?!https?:|mailto:|tel:|#|javascript:|\/)([^"']+)["']/g,
            function (_, attr, value) {
                return `${attr}="${basePrefix}/${value}"`;
            }
        );
    }

    async function loadText(url) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Fetch failed: ${url} (${res.status})`);
        }
        return await res.text();
    }

    function bindSearchInput() {
        const searchInput = document.querySelector(DEFAULTS.searchInputSelector);
        if (!searchInput) return;

        // 防止重复绑定
        if (searchInput.__layoutSearchBound) return;
        searchInput.__layoutSearchBound = true;

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (typeof window.performSearch === 'function') {
                    window.performSearch(this.value);
                }
            }
        });
    }

    function triggerNavHighlight() {
        if (typeof window.setActiveNav !== 'function') return;
        // DOM 注入完成后再高亮一次
        setTimeout(() => window.setActiveNav(), 0);
    }

    async function initLayoutOnce(options) {
        const cfg = { ...DEFAULTS, ...(options || {}) };
        const componentsBasePath = normalizePath(cfg.componentsBasePath);
        const linkBasePrefix = cfg.linkBasePrefix;

        const headerEl = document.getElementById(cfg.headerPlaceholderId);
        const sidebarEl = document.getElementById(cfg.sidebarPlaceholderId);
        const footerEl = document.getElementById(cfg.footerPlaceholderId);

        // 没有这些 placeholder 就说明该页面不是标准布局页面
        if (!headerEl && !sidebarEl && !footerEl) return;

        const [headerHtml, sidebarHtml, footerHtml] = await Promise.all([
            loadText(`${componentsBasePath}/header.html`).then(t => patchRelativeLinks(t, linkBasePrefix)),
            loadText(`${componentsBasePath}/sidebar.html`).then(t => patchRelativeLinks(t, linkBasePrefix)),
            loadText(`${componentsBasePath}/footer.html`).then(t => patchRelativeLinks(t, linkBasePrefix)),
        ]);

        if (headerEl) headerEl.innerHTML = headerHtml;
        if (sidebarEl) sidebarEl.innerHTML = sidebarHtml;
        if (footerEl) footerEl.innerHTML = footerHtml;

        // right-sidebar：有占位符才加载
        const rightSidebarPlaceholders = document.querySelectorAll(cfg.rightSidebarPlaceholderSelector);
        if (rightSidebarPlaceholders && rightSidebarPlaceholders.length > 0) {
            try {
                const rightSidebarHtml = await loadText(`${componentsBasePath}/right-sidebar.html`).then(t => patchRelativeLinks(t, linkBasePrefix));
                rightSidebarPlaceholders.forEach(placeholder => {
                    placeholder.innerHTML = rightSidebarHtml;
                });
            } catch (e) {
                // 不存在不影响主布局
                console.warn('Right sidebar load failed:', e);
            }
        }

        bindSearchInput();
        triggerNavHighlight();

        window.dispatchEvent(new Event('layout:ready'));
    }

    function initLayout(options) {
        // 避免重复执行（如果页面包含多段调用）
        if (window.__layoutInitDone) return;
        const run = () => initLayoutOnce(options).catch(err => {
            console.error('Layout init failed:', err);
        }).finally(() => {
            window.__layoutInitDone = true;
        });

        if (isDomReady()) run();
        else document.addEventListener('DOMContentLoaded', run);
    }

    window.initLayout = initLayout;
})();

