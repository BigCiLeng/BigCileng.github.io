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
function toggleblock(blockId)
{
   var block = document.getElementById(blockId);
   if (block.style.display == 'none') {
    block.style.display = 'block' ;
   } else {
    block.style.display = 'none' ;
   }
}

function hideblock(blockId)
{
   var block = document.getElementById(blockId);
   block.style.display = 'none' ;
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

// 页面加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// 兼容旧版本浏览器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.themeManager) {
            window.themeManager = new ThemeManager();
        }
    });
} else {
    window.themeManager = new ThemeManager();
}