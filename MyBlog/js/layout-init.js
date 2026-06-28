/**
 * @file layout-init.js
 * @description 全局布局初始化模块：公共组件注入、链接修复、搜索绑定、布局就绪事件派发
 * @coupling 对外暴露唯一入口 initLayout，通过 layout:ready 全局事件与其他脚本通信
 * @version 1.1
 */
(function () {
    'use strict';

    // ====================== 常量配置区（集中管理，便于维护） ======================
    const DEFAULT_CONFIG = Object.freeze({
        componentsBasePath: 'components',
        linkBasePrefix: '',
        rightSidebarSelector: '.right-sidebar-placeholder',
        headerId: 'header-placeholder',
        sidebarId: 'sidebar-placeholder',
        footerId: 'footer-placeholder',
        searchInputSelector: 'input[placeholder*="搜索"]'
    });

    // 全局执行标记，防止重复初始化
    const LAYOUT_INIT_FLAG = '__layout_init_completed';

    // ====================== 公共工具函数（内部私有） ======================
    /**
     * 检测DOM状态是否可操作
     * @returns {boolean}
     */
    function checkDomReady() {
        return document.readyState === 'interactive' || document.readyState === 'complete';
    }

    /**
     * 标准化文件路径：统一斜杠、移除末尾多余斜杠
     * @param {string} path 原始路径
     * @returns {string} 格式化路径
     */
    function formatPath(path) {
        return (path || '').replace(/\\/g, '/').replace(/\/+$/, '');
    }

    /**
     * 修补HTML内相对链接，跳过绝对地址/特殊协议
     * @param {string} html 原始HTML文本
     * @param {string} prefix 路径前缀
     * @returns {string} 修复后HTML
     */
    function fixRelativeLinks(html, prefix) {
        if (!prefix) return html;
        return html.replace(
            /(href|src)=["'](?!https?:|mailto:|tel:|#|javascript:|\/)([^"']+)["']/g,
            (_, attr, val) => `${attr}="${prefix}/${val}"`
        );
    }

    /**
     * 异步加载文本资源（组件HTML）
     * @param {string} url 资源地址
     * @returns {Promise<string>}
     * @throws {Error} 加载失败抛出异常
     */
    async function fetchTextResource(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`资源加载失败: ${url} [${res.status}]`);
        return res.text();
    }

    // ====================== 业务逻辑函数（内部私有） ======================
    /**
     * 绑定搜索框回车事件，调用全局 search API
     * @param {string} selector 搜索框选择器
     */
    function bindSearchEvent(selector) {
        const searchInput = document.querySelector(selector);
        if (!searchInput || searchInput.__search_bound) return;

        searchInput.__search_bound = true;
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchFn = window.performSearch;
                if (typeof searchFn === 'function') {
                    searchFn(searchInput.value.trim());
                }
            }
        });
    }

    /**
     * 触发导航高亮（异步延迟确保DOM渲染完成）
     */
    function triggerNavHighlight() {
        const navFn = window.setActiveNav;
        if (typeof navFn === 'function') {
            setTimeout(navFn, 0);
        }
    }

    /**
     * 单次布局执行逻辑：加载+注入所有组件
     * @param {Object} options 自定义配置
     * @returns {Promise<void>}
     */
    async function executeLayoutInit(options) {
        const cfg = { ...DEFAULT_CONFIG, ...options };
        const basePath = formatPath(cfg.componentsBasePath);
        const linkPrefix = cfg.linkBasePrefix;

        // 获取占位容器
        const headerBox = document.getElementById(cfg.headerId);
        const sidebarBox = document.getElementById(cfg.sidebarId);
        const footerBox = document.getElementById(cfg.footerId);

        // 无布局容器则直接终止
        if (!headerBox && !sidebarBox && !footerBox) return;

        // 并行加载核心组件
        const [headerHtml, sidebarHtml, footerHtml] = await Promise.all([
            fetchTextResource(`${basePath}/header.html`).then(h => fixRelativeLinks(h, linkPrefix)),
            fetchTextResource(`${basePath}/sidebar.html`).then(h => fixRelativeLinks(h, linkPrefix)),
            fetchTextResource(`${basePath}/footer.html`).then(h => fixRelativeLinks(h, linkPrefix))
        ]);

        // 注入组件HTML
        headerBox && (headerBox.innerHTML = headerHtml);
        sidebarBox && (sidebarBox.innerHTML = sidebarHtml);
        footerBox && (footerBox.innerHTML = footerHtml);

        // 可选：加载右侧边栏（容错，失败不阻塞主流程）
        const rightSideList = document.querySelectorAll(cfg.rightSidebarSelector);
        if (rightSideList.length) {
            try {
                const rightHtml = await fetchTextResource(`${basePath}/right-sidebar.html`)
                    .then(h => fixRelativeLinks(h, linkPrefix));
                rightSideList.forEach(el => el.innerHTML = rightHtml);

                // 右侧边栏加载完成后，触发统计数据更新
                const updateFn = window.updateSiteStats;
                if (typeof updateFn === 'function') {
                    updateFn();
                }
            } catch (err) {
                console.warn('右侧边栏加载异常（不影响主布局）:', err.message);
            }
        }

        // 绑定事件 & 触发回调
        bindSearchEvent(cfg.searchInputSelector);
        triggerNavHighlight();

        // 派发全局布局就绪事件，供其他脚本监听
        window.dispatchEvent(new CustomEvent('layout:ready'));
    }

    // ====================== 对外公开API ======================
    /**
     * 布局初始化入口函数
     * @param {Object} [options] 自定义配置项
     */
    window.initLayout = function initLayout(options) {
        // 防止重复执行
        if (window[LAYOUT_INIT_FLAG]) return;

        const runTask = async () => {
            try {
                await executeLayoutInit(options);
            } catch (err) {
                console.error('布局初始化失败:', err.message);
            } finally {
                window[LAYOUT_INIT_FLAG] = true;
            }
        };

        // 根据DOM状态选择执行时机
        checkDomReady() ? runTask() : document.addEventListener('DOMContentLoaded', runTask);
    };

})();