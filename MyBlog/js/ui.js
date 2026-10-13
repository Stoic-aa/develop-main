/**
 * @file ui.js
 * @description 全站通用交互：主题模式、移动端侧边栏、导航高亮、设置菜单、阅读模式、通知提示
 * @listen layout:ready 布局就绪后绑定交互
 * @depend 全局工具：window.normalizePath / window.getCurrentSlug / window.getArticleSlug（js/utils.js）
 * @version 1.0
 */
(function () {
    'use strict';

    const MOBILE_SIDEBAR_FLAG = '__mobile_sidebar_bound';
    const THEME_KEY = 'theme';

    // ====================== 主题模式 ======================
    // 浅色 / 灰色（灰色配色由 html.dark 承载，见 css/style.css）
    // 优先读取本地存储，其次跟随系统偏好；本地存储值：'light' | 'gray'

    /**
     * 应用主题模式
     * @param {'light'|'gray'} mode
     */
    function applyThemeMode(mode) {
        const isGray = mode === 'gray';
        document.documentElement.classList.toggle('dark', isGray);
        updateGrayModeIndicator(isGray);
    }

    /**
     * 更新设置菜单里的灰色模式开关状态
     * @param {boolean} isGray
     */
    function updateGrayModeIndicator(isGray) {
        const status = document.getElementById('gray-mode-status');
        const knob = document.getElementById('gray-mode-knob');
        if (!status || !knob) return;

        status.classList.toggle('bg-primary', isGray);
        status.classList.toggle('bg-surface-container-high', !isGray);
        knob.classList.toggle('bg-white', isGray);
        knob.classList.toggle('bg-outline-variant', !isGray);
        knob.style.transform = isGray ? 'translateX(20px)' : '';
    }

    function setupDarkModeToggle() {
        const storedTheme = localStorage.getItem(THEME_KEY);
        const preferGray = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const mode = (storedTheme === 'gray' || storedTheme === 'light')
            ? storedTheme
            : (preferGray ? 'gray' : 'light');

        applyThemeMode(mode);

        // 监听系统主题变化（未手动选择时才跟随）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyThemeMode(e.matches ? 'gray' : 'light');
            }
        });
    }
    // 暴露给详情页使用
    window.setupDarkModeToggle = setupDarkModeToggle;

    /**
     * 手动切换 浅色 / 灰色 模式（设置菜单调用）
     */
    window.toggleGrayMode = function toggleGrayMode() {
        const isGray = document.documentElement.classList.contains('dark');
        const next = isGray ? 'light' : 'gray';
        localStorage.setItem(THEME_KEY, next);
        applyThemeMode(next);
    };

    // ====================== 移动端侧边栏 ======================
    /**
     * 移动端侧边栏（带DOM重试）
     * @param {number} retry 重试次数
     */
    function setupMobileSidebar(retry = 20) {
        if (window[MOBILE_SIDEBAR_FLAG]) return;

        const menuBtn = document.getElementById('mobile-menu-button');
        const overlay = document.getElementById('mobile-sidebar-overlay');
        const sidebar = document.getElementById('mobile-sidebar');

        if (!menuBtn || !overlay || !sidebar) {
            if (retry > 0) {
                setTimeout(() => setupMobileSidebar(retry - 1), 150);
            }
            return;
        }

        const lgMedia = window.matchMedia('(min-width: 1024px)');
        const isMobile = () => !lgMedia.matches;
        const getEditFAB = () => Array.from(document.querySelectorAll('button.lg\\:hidden'))
            .filter(btn => {
                const icon = btn.querySelector('.material-symbols-outlined');
                return icon && icon.textContent.trim() === 'edit';
            });

        const openSidebar = () => {
            if (!isMobile()) return;
            overlay.classList.remove('hidden');
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            document.body.classList.add('overflow-hidden');
            getEditFAB().forEach(btn => btn.style.pointerEvents = 'none');
        };

        const closeSidebar = () => {
            if (!isMobile()) return;
            overlay.classList.add('hidden');
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
            document.body.classList.remove('overflow-hidden');
            getEditFAB().forEach(btn => btn.style.pointerEvents = 'auto');
        };

        window[MOBILE_SIDEBAR_FLAG] = true;
        menuBtn.addEventListener('click', openSidebar);
        overlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', e => e.key === 'Escape' && closeSidebar());
        sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSidebar));
        getEditFAB().forEach(btn => btn.addEventListener('click', () => {
            overlay.classList.contains('hidden') ? openSidebar() : closeSidebar();
        }));
    }

    // ====================== 导航栏高亮 ======================
    /**
     * 导航栏高亮匹配
     */
    window.setActiveNav = function setActiveNav() {
        const { normalizePath, getCurrentSlug, getArticleSlug } = window;
        const fullPath = window.location.pathname;
        const fileName = normalizePath(fullPath);
        const currentSlug = getCurrentSlug();
        const navLinks = document.querySelectorAll('.flex-1.space-y-1 a');

        const baseCls = ['text-on-surface-variant', 'hover:text-on-surface'];
        const activeCls = ['bg-primary/10', 'text-primary', 'rounded-lg'];

        navLinks.forEach(link => {
            link.classList.remove(...activeCls);
            link.classList.add(...baseCls);
            const linkHref = normalizePath(link.getAttribute('href'));
            let isMatch = false;

            // 1. 首页分支：首页 + 首页下所有文章，都高亮首页导航
            if (linkHref === 'index.html' || linkHref === '') {
                // 根路径 / 、index.html、以及无专属分类的文章，都归属首页分支
                isMatch = fullPath === '/' || fileName === 'index.html';
                // 额外兼容：文章详情归属首页分支
                if (!isMatch && window.articlesData) {
                    const currArt = window.articlesData.find(art => {
                        const artSlug = getArticleSlug(art.url);
                        const artFile = normalizePath(art.url);
                        return currentSlug ? artSlug === currentSlug : artFile === fileName;
                    });
                    // 文章未指定分类页 → 属于首页分支
                    if (currArt && (!currArt.categoryPage || normalizePath(currArt.categoryPage) === '' || normalizePath(currArt.categoryPage) === 'index.html')) {
                        isMatch = true;
                    }
                }
            }
            // 2. 其他分类分支：当前页面/文章属于该分类则高亮
            else {
                // 精确命中分类页本身
                if (fileName === linkHref) {
                    isMatch = true;
                }
                // 命中该分类下的所有文章
                if (!isMatch && window.articlesData) {
                    const currArt = window.articlesData.find(art => {
                        const artSlug = getArticleSlug(art.url);
                        const artFile = normalizePath(art.url);
                        return currentSlug ? artSlug === currentSlug : artFile === fileName;
                    });
                    if (currArt && normalizePath(currArt.categoryPage) === linkHref) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch) {
                link.classList.remove(...baseCls);
                link.classList.add(...activeCls);
            }
        });
    };

    // ====================== 设置菜单功能 ======================
    /**
     * 返回顶部
     */
    window.scrollToTop = function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    /**
     * 切换阅读模式
     */
    window.toggleReadMode = function toggleReadMode() {
        const isEnabled = document.body.classList.toggle('read-mode');
        localStorage.setItem('readMode', isEnabled.toString());

        // 更新状态指示器
        updateReadModeIndicator(isEnabled);
    };

    /**
     * 更新阅读模式状态指示
     * @param {boolean} isEnabled 是否开启阅读模式
     */
    function updateReadModeIndicator(isEnabled) {
        // 更新按钮上的小圆点指示器
        const indicator = document.getElementById('read-mode-indicator');
        if (indicator) {
            indicator.style.opacity = isEnabled ? '1' : '0';
        }

        // 更新下拉菜单中的开关
        const statusSwitch = document.getElementById('read-mode-status');
        const switchKnob = statusSwitch?.querySelector('span');

        if (statusSwitch && switchKnob) {
            if (isEnabled) {
                statusSwitch.classList.add('bg-primary');
                statusSwitch.classList.remove('bg-surface-container-high');
                switchKnob.classList.add('bg-white');
                switchKnob.classList.remove('bg-outline-variant');
                switchKnob.style.transform = 'translateX(20px)';
            } else {
                statusSwitch.classList.remove('bg-primary');
                statusSwitch.classList.add('bg-surface-container-high');
                switchKnob.classList.remove('bg-white');
                switchKnob.classList.add('bg-outline-variant');
                switchKnob.style.transform = '';
            }
        }
    }

    /**
     * 初始化设置菜单
     */
    function initSettingsMenu() {
        // 应用保存的阅读模式
        const readMode = localStorage.getItem('readMode') === 'true';
        if (readMode) {
            document.body.classList.add('read-mode');
        }

        // 更新初始状态指示
        updateReadModeIndicator(readMode);

        // 绑定设置菜单事件
        bindSettingsDropdown();
    }

    /**
     * 绑定设置下拉菜单事件
     */
    function bindSettingsDropdown() {
        const overlay = document.getElementById('settings-dropdown-overlay');
        const toggleBtn = document.getElementById('settings-toggle-btn');

        // 点击按钮切换菜单显示
        toggleBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
                setTimeout(() => {
                    document.addEventListener('click', handleSettingsDropdownClick);
                }, 0);
            }
        });

        // 点击遮罩关闭菜单
        overlay?.addEventListener('click', () => {
            overlay.classList.add('hidden');
            document.removeEventListener('click', handleSettingsDropdownClick);
        });
    }

    /**
     * 点击文档其他地方关闭设置菜单
     */
    function handleSettingsDropdownClick(e) {
        const dropdown = document.getElementById('settings-dropdown');
        const toggleBtn = document.getElementById('settings-toggle-btn');
        const overlay = document.getElementById('settings-dropdown-overlay');

        if (!dropdown?.contains(e.target) && !toggleBtn?.contains(e.target)) {
            overlay?.classList.add('hidden');
            document.removeEventListener('click', handleSettingsDropdownClick);
        }
    }

    // ====================== 通知提示功能 ======================
    // 幽默提示语列表
    const funnyMessages = [
        '🎉 恭喜你发现了一个神秘按钮！不过...暂时没有新通知哦~',
        '🔔 叮！您的代码正在努力运行中，请稍候...',
        '📬 邮箱空空如也，不如写篇博客充实一下？',
        '💡 提示：按 Ctrl+D 可以收藏本站哦！',
        '🚀 新功能正在路上，敬请期待！',
        '🍵 休息一下吧，眼睛需要爱护~',
        '🤖 系统检测到您正在努力工作，奖励一个虚拟饼干 🍪',
        '🌟 您已解锁成就："爱探索的程序员"',
        '📚 最近有学习新技能吗？知识就是力量！',
        '🎮 劳逸结合，效率翻倍！',
        '🌈 今天也要元气满满哦！',
        '💻 代码写累了？来杯咖啡继续战斗！'
    ];

    /**
     * 显示幽默通知提示
     */
    function showNotification() {
        const toast = document.getElementById('notification-toast');
        const messageEl = document.getElementById('notification-message');

        if (!toast || !messageEl) return;

        // 随机选择一条消息
        const randomIndex = Math.floor(Math.random() * funnyMessages.length);
        messageEl.textContent = funnyMessages[randomIndex];

        // 显示弹窗
        toast.classList.remove('opacity-0', 'invisible');
        toast.classList.add('opacity-100', 'visible');
        toast.style.transform = 'translateY(0)';

        // 3秒后自动隐藏
        setTimeout(hideNotification, 4000);
    }

    /**
     * 隐藏通知提示
     */
    function hideNotification() {
        const toast = document.getElementById('notification-toast');
        if (!toast) return;

        toast.classList.remove('opacity-100', 'visible');
        toast.classList.add('opacity-0', 'invisible');
        toast.style.transform = 'translateY(4px)';
    }
    // 通知弹窗的关闭按钮通过内联 onclick 调用，需挂到全局
    window.hideNotification = hideNotification;

    /**
     * 绑定通知按钮事件
     */
    function bindNotificationButton() {
        const notificationBtn = document.getElementById('notification-btn');
        notificationBtn?.addEventListener('click', showNotification);
    }

    // ====================== 入口：布局就绪后绑定交互 ======================
    window.addEventListener('layout:ready', () => {
        setupDarkModeToggle();
        setupMobileSidebar();
        window.setActiveNav();
        initSettingsMenu();
        bindNotificationButton();
    });

})();
