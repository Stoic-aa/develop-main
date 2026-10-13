/**
 * @file bootstrap.js
 * @description 全站脚本启动器：统一按顺序加载公共脚本、读取页面配置、启动布局初始化
 * @usage 站点根目录页面：
 *        <script src="js/bootstrap.js"></script>
 *        需要额外脚本 / 子目录时用 data-* 覆盖：
 *        <script src="../js/bootstrap.js"
 *                data-components="../components"
 *                data-link-prefix=".."
 *                data-modules="article-detail"></script>
 * @version 1.0
 */
(function () {
    'use strict';

    // ====================== 常量配置区 ======================
    // 公共脚本加载顺序（严格串行：后面的脚本依赖前面的全局变量）
    const COMMON_SCRIPTS = ['articles-data.js', 'utils.js', 'article-list.js', 'ui.js', 'layout-init.js'];

    // 默认页面配置（data-* 未提供时生效）
    const DEFAULT_OPTIONS = Object.freeze({
        components: 'components',
        linkPrefix: ''
    });

    // 当前脚本标签：既提供页面配置，也用于推导 js 目录地址
    const scriptTag = document.currentScript;

    // ====================== 公共工具函数 ======================
    /**
     * 由当前脚本地址推导 js 目录的绝对 URL
     * @returns {string} 例：https://www.mylog.world/js
     */
    function resolveScriptDir() {
        const src = (scriptTag && scriptTag.src) || '';
        return src.replace(/\/[^/]*$/, '');
    }

    /**
     * 按顺序加载一个经典脚本
     * @param {string} url 脚本绝对地址
     * @returns {Promise<void>}
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = url;
            el.onload = () => resolve();
            el.onerror = () => reject(new Error(`脚本加载失败: ${url}`));
            document.head.appendChild(el);
        });
    }

    /**
     * 解析 data-modules 属性（逗号分隔的脚本名，对应 js/<名字>.js）
     * @returns {string[]}
     */
    function resolveModules() {
        const raw = (scriptTag && scriptTag.dataset.modules) || '';
        return raw.split(',').map(name => name.trim()).filter(Boolean);
    }

    // ====================== 页面配置 ======================
    const options = {
        components: (scriptTag && scriptTag.dataset.components) || DEFAULT_OPTIONS.components,
        linkPrefix: (scriptTag && scriptTag.dataset.linkPrefix !== undefined)
            ? scriptTag.dataset.linkPrefix
            : DEFAULT_OPTIONS.linkPrefix
    };
    const modules = resolveModules();

    // ====================== 启动流程 ======================
    async function boot() {
        const dir = resolveScriptDir();

        try {
            // 1. 公共脚本串行加载，保证依赖顺序
            for (const file of COMMON_SCRIPTS) {
                await loadScript(`${dir}/${file}`);
            }

            // 2. 页面级可选脚本
            for (const name of modules) {
                await loadScript(`${dir}/${name}.js`);
            }
        } catch (err) {
            console.error('脚本启动失败:', err.message);
            return;
        }

        // 3. 公共脚本就绪后再启动布局（layout-init 内部已处理 DOM 未就绪的情况）
        if (typeof window.initLayout === 'function') {
            window.initLayout({
                componentsBasePath: options.components,
                linkBasePrefix: options.linkPrefix
            });
        } else {
            console.error('initLayout 未定义，请确认 layout-init.js 是否加载成功');
        }
    }

    boot();

})();
