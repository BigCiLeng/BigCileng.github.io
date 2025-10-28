/*
 * @Author: BigCiLeng && bigcileng@outlook.com
 * @Date: 2024-01-07 13:58:54
 * @LastEditors: BigCiLeng && bigcileng@outlook.com
 * @LastEditTime: 2024-01-07 13:58:58
 * @FilePath: \BigCileng.github.io\scripts\functions.js
 * @Description: 
 * 
 * Copyright (c) 2023 by bigcileng@outlook.com, All Rights Reserved. 
 */
function toggleblock(blockId, trigger) {
    var block = document.getElementById(blockId);
    if (!block) {
        return;
    }

    var isHidden = block.hasAttribute('hidden') || block.style.display === 'none' || block.dataset.visible === 'false';
    if (isHidden) {
        block.removeAttribute('hidden');
        block.style.display = '';
        block.removeAttribute('aria-hidden');
        block.dataset.visible = 'true';
    } else {
        block.setAttribute('hidden', 'true');
        block.style.display = 'none';
        block.setAttribute('aria-hidden', 'true');
        block.dataset.visible = 'false';
    }

    if (trigger) {
        trigger.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    }
}

function hideblock(blockId, trigger) {
    var block = document.getElementById(blockId);
    if (!block) {
        return;
    }

    block.setAttribute('hidden', 'true');
    block.style.display = 'none';
    block.setAttribute('aria-hidden', 'true');
    block.dataset.visible = 'false';

    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
    }
}

// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        // 设置初始主题
        this.applyTheme(this.currentTheme);
        
        // 绑定切换按钮事件
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    storeTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.storeTheme(theme);
        
        // 更新按钮状态
        this.updateToggleButton();
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // 添加切换动画效果
        this.addToggleAnimation();
    }

    updateToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.setAttribute('aria-label', 
                this.currentTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'
            );
        }
    }

    addToggleAnimation() {
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
    }
}

function renderNewsTimeline(expanded) {
    var list = document.getElementById('news-list');
    if (!list) {
        return;
    }

    var items = window.NEWS_ITEMS;
    if (!Array.isArray(items) || !items.length) {
        list.innerHTML = '';
        return;
    }

    var fragment = document.createDocumentFragment();

    var visibleCount = expanded ? items.length : Math.min(items.length, 5);

    items.slice(0, visibleCount).forEach(function (item, index) {
        if (!item) {
            return;
        }

        var entry = document.createElement('li');
        entry.className = 'news-item';
        if (index < 3) {
            entry.classList.add('news-item--accent');
        }

        var time = document.createElement('time');
        time.className = 'news-date';
        if (item.date) {
            time.setAttribute('datetime', item.date);
        }
        time.textContent = item.label || item.date || '';

        if (item.isNew) {
            time.classList.add('is-new');
        }

        var text = document.createElement('p');
        text.className = 'news-text';
        text.innerHTML = item.html || item.text || '';

        entry.appendChild(time);
        entry.appendChild(text);
        fragment.appendChild(entry);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
}

function initNewsTimeline() {
    var items = window.NEWS_ITEMS;
    var total = Array.isArray(items) ? items.length : 0;
    var actions = document.getElementById('news-actions');
    var toggle = document.getElementById('news-toggle');

    if (!document.getElementById('news-list')) {
        return;
    }

    var state = { expanded: false };
    var updateToggleLabel = function () {
        if (!toggle) {
            return;
        }

        var hiddenCount = Math.max(total - 5, 0);
        if (hiddenCount <= 0) {
            toggle.hidden = true;
            return;
        }

        toggle.hidden = false;
        toggle.dataset.expanded = state.expanded ? 'true' : 'false';
        toggle.setAttribute('aria-expanded', state.expanded ? 'true' : 'false');
        toggle.setAttribute('aria-pressed', state.expanded ? 'true' : 'false');

        if (state.expanded) {
            toggle.textContent = 'Show recent 5';
            toggle.setAttribute('aria-label', 'Collapse news list to the most recent five updates');
        } else {
            toggle.textContent = 'Show all news (' + total + ')';
            toggle.setAttribute('aria-label', 'Expand to view all ' + total + ' news updates');
        }
    };

    renderNewsTimeline(false);

    if (!toggle || total <= 5) {
        if (actions) {
            actions.hidden = true;
        }
        if (toggle) {
            toggle.hidden = true;
        }
        return;
    }

    if (actions) {
        actions.hidden = false;
    }

    updateToggleLabel();

    toggle.addEventListener('click', function () {
        state.expanded = !state.expanded;
        renderNewsTimeline(state.expanded);
        updateToggleLabel();
    });
}

function initLazyMedia() {
    var videos = Array.prototype.slice.call(document.querySelectorAll('video[data-src]'));
    if (!videos.length) {
        return;
    }

    var loadVideo = function (video) {
        if (!video || video.dataset.loaded === 'true') {
            return;
        }

        var src = video.dataset.src;
        if (!src) {
            return;
        }

        video.src = src;
        video.load();
        video.dataset.loaded = 'true';
        video.removeAttribute('data-src');

        if (typeof video.play === 'function') {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(function () { /* ignore autoplay blocks */ });
            }
        }
    };

    var observer = null;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    loadVideo(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '120px 0px',
            threshold: 0.2
        });
    }

    videos.forEach(function (video) {
        if (observer) {
            observer.observe(video);
        } else {
            loadVideo(video);
        }

        video.addEventListener('mouseenter', function () {
            loadVideo(video);
        }, { once: true });

        video.addEventListener('focus', function () {
            loadVideo(video);
        }, { once: true });
    });
}

function initSiteScripts() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
    initNewsTimeline();
    initLazyMedia();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteScripts, { once: true });
} else {
    initSiteScripts();
}
