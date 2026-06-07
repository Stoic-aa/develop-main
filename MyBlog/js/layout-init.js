/**
 * 统一的布局初始化模块
 * 
 * 功能：
 * - 动态注入 header / sidebar / footer / right-sidebar（若页面存在对应占位符）
 * - 自动修补组件内的相对链接（根据传入的 linkBasePrefix）
 * - 绑定搜索输入框的 Enter 键 → 调用 window.performSearch
 * - 组件注入完成后触发 window.setActiveNav（导航高亮）
 * - 派发全局事件 `layout:ready`
 * 
 * 使用方式：
 *   普通页面： initLayout({ componentsBasePath: 'components', linkBasePrefix: '' })
 *   文章详情页： initLayout({ componentsBasePath: '../components', linkBasePrefix: '..' })
 * 
 * @author (保持原有作者)
 * @version 1.0
 */

(function () {
    // =========================== 默认配置 ===========================
    /** @type {Object} 默认配置项 */
    const DEFAULTS = {
        /** 组件文件所在的相对路径（如 'components' 或 '../components'） */
        componentsBasePath: 'components',
        /** 注入 HTML 时，为相对链接添加的前缀（如 '..' 用于文章页） */
        linkBasePrefix: '',
        /** 右侧栏占位符的选择器（支持多个） */
        rightSidebarPlaceholderSelector: '.right-sidebar-placeholder',
        /** header 占位符的 id */
        headerPlaceholderId: 'header-placeholder',
        /** sidebar 占位符的 id */
        sidebarPlaceholderId: 'sidebar-placeholder',
        /** footer 占位符的 id */
        footerPlaceholderId: 'footer-placeholder',
        /** 搜索输入框的选择器（placeholder 包含“搜索”） */
        searchInputSelector: 'input[placeholder*="搜索"]',
    };

    // =========================== 工具函数 ===========================
    /**
     * 判断 DOM 是否已处于可操作状态（interactive 或 complete）
     * @returns {boolean}
     */
    function isDomReady() {
        return document.readyState === 'interactive' || document.readyState === 'complete';
    }

    /**
     * 标准化路径：将反斜线替换为正斜线，并去除末尾多余的斜杠
     * @param {string} path - 原始路径
     * @returns {string} 标准化后的路径
     */
    function normalizePath(path) {
        return (path || '').replace(/\\/g, '/').replace(/\/+$/g, '');
    }

    /**
     * 修补 HTML 字符串中的相对链接（href/src），为其添加 basePrefix 前缀
     * 跳过绝对 URL、# 锚点、/ 开头的绝对路径、javascript:、mailto:、tel: 等协议
     * @param {string} html - 原始 HTML 字符串
     * @param {string} basePrefix - 需要添加的前缀（如 '..'）
     * @returns {string} 修补后的 HTML
     */
    function patchRelativeLinks(html, basePrefix) {
        if (!basePrefix) return html;
        // 正则匹配 href 或 src 属性，且值不是绝对链接或特殊协议
        return html.replace(
            /(href|src)=["'](?!https?:|mailto:|tel:|#|javascript:|\/)([^"']+)["']/g,
            (_, attr, value) => `${attr}="${basePrefix}/${value}"`
        );
    }

    /**
     * 通过 fetch 加载文本文件
     * @param {string} url - 文件 URL
     * @returns {Promise<string>}
     * @throws 当 HTTP 状态码非 2xx 时抛出错误
     */
    async function loadText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fetch failed: ${url} (${response.status})`);
        }
        return await response.text();
    }

    // =========================== 功能函数 ===========================
    /**
     * 绑定搜索输入框：按 Enter 键时调用全局 performSearch 函数
     * 为避免重复绑定，在输入框元素上添加 __layoutSearchBound 标记
     */
    function bindSearchInput() {
        const searchInput = document.querySelector(DEFAULTS.searchInputSelector);
        if (!searchInput) return;

        if (searchInput.__layoutSearchBound) return;
        searchInput.__layoutSearchBound = true;

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (typeof window.performSearch === 'function') {
                    window.performSearch(searchInput.value);
                }
            }
        });
    }

    /**
     * 触发导航栏高亮更新（延迟到下一个事件循环，确保 DOM 已完全注入）
     * 仅当 window.setActiveNav 存在时调用
     */
    function triggerNavHighlight() {
        if (typeof window.setActiveNav !== 'function') return;
        setTimeout(() => window.setActiveNav(), 0);
    }

    /**
     * 执行一次布局初始化（加载所有组件并注入页面）
     * @param {Object} options - 用户配置（与 DEFAULTS 合并）
     * @returns {Promise<void>}
     */
    async function initLayoutOnce(options) {
        // 合并配置
        const cfg = { ...DEFAULTS, ...(options || {}) };
        const componentsBasePath = normalizePath(cfg.componentsBasePath);
        const linkBasePrefix = cfg.linkBasePrefix;

        // 获取各个占位符元素
        const headerEl = document.getElementById(cfg.headerPlaceholderId);
        const sidebarEl = document.getElementById(cfg.sidebarPlaceholderId);
        const footerEl = document.getElementById(cfg.footerPlaceholderId);

        // 如果没有任何布局占位符，则说明当前页面不是标准布局页，直接返回
        if (!headerEl && !sidebarEl && !footerEl) return;

        // 并行加载 header、sidebar、footer 组件 HTML，并修补相对链接
        const [headerHtml, sidebarHtml, footerHtml] = await Promise.all([
            loadText(`${componentsBasePath}/header.html`).then(html => patchRelativeLinks(html, linkBasePrefix)),
            loadText(`${componentsBasePath}/sidebar.html`).then(html => patchRelativeLinks(html, linkBasePrefix)),
            loadText(`${componentsBasePath}/footer.html`).then(html => patchRelativeLinks(html, linkBasePrefix)),
        ]);

        if (headerEl) headerEl.innerHTML = headerHtml;
        if (sidebarEl) sidebarEl.innerHTML = sidebarHtml;
        if (footerEl) footerEl.innerHTML = footerHtml;

        // 加载右侧栏组件（如果存在占位符）
        const rightSidebarPlaceholders = document.querySelectorAll(cfg.rightSidebarPlaceholderSelector);
        if (rightSidebarPlaceholders.length > 0) {
            try {
                const rightSidebarHtml = await loadText(`${componentsBasePath}/right-sidebar.html`)
                    .then(html => patchRelativeLinks(html, linkBasePrefix));
                rightSidebarPlaceholders.forEach(placeholder => {
                    placeholder.innerHTML = rightSidebarHtml;
                });
            } catch (error) {
                // 右侧栏组件可能不存在，不影响主布局，仅输出警告
                console.warn('Right sidebar load failed:', error);
            }
        }

        // 绑定搜索行为
        bindSearchInput();
        // 触发导航高亮
        triggerNavHighlight();

        // 派发全局事件，通知其他脚本布局已准备就绪
        window.dispatchEvent(new Event('layout:ready'));
    }

    // =========================== 公开 API ===========================
    /**
     * 初始化布局（入口函数）
     * - 自动防止重复执行（通过 window.__layoutInitDone 标志）
     * - 如果 DOM 已就绪则立即执行，否则等待 DOMContentLoaded
     * 
     * @param {Object} [options] - 可选配置，覆盖默认值
     * @param {string} [options.componentsBasePath='components'] - 组件目录相对路径
     * @param {string} [options.linkBasePrefix=''] - 为组件内相对链接添加的前缀
     * @param {string} [options.rightSidebarPlaceholderSelector='.right-sidebar-placeholder'] - 右侧栏占位符选择器
     * @param {string} [options.headerPlaceholderId='header-placeholder'] - header 占位符 ID
     * @param {string} [options.sidebarPlaceholderId='sidebar-placeholder'] - sidebar 占位符 ID
     * @param {string} [options.footerPlaceholderId='footer-placeholder'] - footer 占位符 ID
     * @param {string} [options.searchInputSelector='input[placeholder*="搜索"]'] - 搜索输入框选择器
     */
    function initLayout(options) {
        if (window.__layoutInitDone) return;

        const run = () => {
            initLayoutOnce(options)
                .catch(error => {
                    console.error('Layout init failed:', error);
                })
                .finally(() => {
                    window.__layoutInitDone = true;
                });
        };

        if (isDomReady()) {
            run();
        } else {
            document.addEventListener('DOMContentLoaded', run);
        }
    }

    // 将 initLayout 挂载到全局对象
    window.initLayout = initLayout;
})();