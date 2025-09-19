/**
 * 主题管理器 - 支持通过配置文件切换主题颜色
 * @author BigCiLeng
 */

class ThemeColorManager {
    constructor() {
        this.themes = {};
        this.currentColorTheme = 'klein';
        this.currentMode = 'light'; // light or dark
        this.init();
    }

    async init() {
        try {
            // 加载主题配置文件
            await this.loadThemeConfig();
            
            // 从localStorage获取保存的主题设置
            this.currentColorTheme = localStorage.getItem('colorTheme') || 'klein';
            this.currentMode = localStorage.getItem('themeMode') || this.getPreferredMode();
            
            // 应用主题
            this.applyTheme(this.currentColorTheme, this.currentMode);
            
            // 初始化主题选择器
            this.initThemeSelector();
            
            // 绑定原有的日夜切换按钮
            this.bindModeToggle();
            
            console.log('主题管理器初始化完成');
        } catch (error) {
            console.error('主题管理器初始化失败:', error);
            // 降级到默认主题
            this.applyDefaultTheme();
        }
    }

    async loadThemeConfig() {
        try {
            const response = await fetch('./themes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const config = await response.json();
            this.themes = config.themes;
            this.defaultTheme = config.defaultTheme || 'klein';
        } catch (error) {
            console.error('加载主题配置失败:', error);
            // 使用内置的默认主题配置
            this.themes = this.getBuiltinThemes();
            this.defaultTheme = 'klein';
        }
    }

    getBuiltinThemes() {
        return {
            klein: {
                name: "Klein Blue",
                colors: {
                    primary: "#002fa7",
                    primaryHover: "#001f73",
                    primaryLight: "#0040d9",
                    accent: "#64748b",
                    accentHover: "#475569",
                    accentLight: "#e2e8f0",
                    highlight: "#eff6ff",
                    highlightBorder: "#3b82f6"
                }
            }
        };
    }

    getPreferredMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(colorTheme, mode) {
        const theme = this.themes[colorTheme];
        if (!theme) {
            console.warn(`主题 "${colorTheme}" 不存在，使用默认主题`);
            colorTheme = this.defaultTheme;
        }

        this.currentColorTheme = colorTheme;
        this.currentMode = mode;

        // 设置CSS变量
        this.setCSSVariables(this.themes[colorTheme], mode);
        
        // 设置data属性
        document.documentElement.setAttribute('data-theme', mode);
        document.documentElement.setAttribute('data-color-theme', colorTheme);
        
        // 保存到localStorage
        localStorage.setItem('colorTheme', colorTheme);
        localStorage.setItem('themeMode', mode);
        
        // 触发主题变更事件
        this.dispatchThemeChangeEvent(colorTheme, mode);
        
        console.log(`应用主题: ${colorTheme} (${mode})`);
    }

    setCSSVariables(theme, mode) {
        const root = document.documentElement;
        const colors = theme.colors;
        
        // 基础颜色变量
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--primary-hover', colors.primaryHover);
        root.style.setProperty('--primary-light', colors.primaryLight);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--accent-hover', colors.accentHover);
        root.style.setProperty('--accent-light', colors.accentLight);
        
        // 蓝色系变量（使用主色调）
        root.style.setProperty('--blue-accent', colors.primary);
        root.style.setProperty('--blue-hover', colors.primaryHover);
        
        // 高亮颜色
        root.style.setProperty('--highlight-bg-soft', colors.highlight);
        
        // 渐变效果
        root.style.setProperty('--gradient-primary', 
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`);
        root.style.setProperty('--gradient-accent', 
            `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentHover} 100%)`);
        
        // 高亮渐变效果 - 基于主题色彩
        root.style.setProperty('--highlight-soft', 
            `linear-gradient(135deg, ${colors.highlightBorder} 0%, ${colors.primary} 50%, ${colors.primaryLight} 100%)`);
        
        // 根据模式调整其他颜色
        if (mode === 'dark') {
            this.setDarkModeColors(colors);
        } else {
            this.setLightModeColors(colors);
        }
    }

    setLightModeColors(colors) {
        const root = document.documentElement;
        
        // 浅色模式的背景和文字颜色
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#fafbfc');
        root.style.setProperty('--bg-tertiary', '#f3f4f6');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#374151');
        root.style.setProperty('--text-muted', '#6b7280');
        root.style.setProperty('--border-color', '#e5e7eb');
        root.style.setProperty('--blue-light', '#f1f5f9');
    }

    setDarkModeColors(colors) {
        const root = document.documentElement;
        
        // 深色模式的背景和文字颜色
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#1f2937');
        root.style.setProperty('--bg-tertiary', '#374151');
        root.style.setProperty('--text-primary', '#f9fafb');
        root.style.setProperty('--text-secondary', '#e5e7eb');
        root.style.setProperty('--text-muted', '#d1d5db');
        root.style.setProperty('--border-color', '#374151');
        root.style.setProperty('--blue-light', '#1e293b');
        
        // 深色模式的高亮颜色调整
        const highlightColor = this.adjustColorForDarkMode(colors.highlight);
        root.style.setProperty('--highlight-bg-soft', highlightColor);
        
        // 深色模式的高亮渐变效果
        const darkHighlightGradient = this.getDarkModeHighlightGradient(colors);
        root.style.setProperty('--highlight-soft', darkHighlightGradient);
    }

    adjustColorForDarkMode(lightColor) {
        // 简单的颜色调整算法，将浅色转换为适合深色模式的颜色
        // 这里可以根据需要实现更复杂的颜色转换逻辑
        const colorMap = {
            '#eff6ff': 'rgba(0, 47, 167, 0.3)', // Klein Blue的深色模式
            '#f0fdf4': 'rgba(64, 125, 82, 0.25)', // 薄荷绿的深色模式
            '#fef3c7': 'rgba(146, 64, 14, 0.3)',
            '#fef3e2': 'rgba(146, 64, 14, 0.3)',
            '#fef7ff': 'rgba(124, 58, 237, 0.3)',
            '#fef2f2': 'rgba(220, 38, 38, 0.3)',
            '#f0fdfa': 'rgba(13, 148, 136, 0.3)',
            '#fff7ed': 'rgba(234, 88, 12, 0.3)'
        };
        return colorMap[lightColor] || 'rgba(0, 47, 167, 0.3)';
    }

    getDarkModeHighlightGradient(colors) {
        // 为深色模式生成合适的高亮渐变
        const darkPrimary = this.adjustColorBrightness(colors.primary, 0.7);
        const darkPrimaryLight = this.adjustColorBrightness(colors.primaryLight, 0.6);
        const darkHighlightBorder = this.adjustColorBrightness(colors.highlightBorder, 0.8);
        
        return `linear-gradient(135deg, ${darkHighlightBorder} 0%, ${darkPrimary} 50%, ${darkPrimaryLight} 100%)`;
    }

    adjustColorBrightness(hexColor, factor) {
        // 将十六进制颜色转换为RGB并调整亮度
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);
        
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    initThemeSelector() {
        // 隐藏主题选择器UI - 用户不需要手动切换主题
        // this.createThemeSelector();
    }

    createThemeSelector() {
        // 检查是否已存在主题选择器
        if (document.getElementById('theme-color-selector')) {
            return;
        }

        const selector = document.createElement('div');
        selector.id = 'theme-color-selector';
        selector.className = 'theme-color-selector';
        selector.innerHTML = `
            <button class="theme-selector-btn" title="选择主题颜色">
                <i class="fas fa-palette"></i>
            </button>
            <div class="theme-options">
                ${Object.entries(this.themes).map(([key, theme]) => `
                    <button class="theme-option" data-theme="${key}" title="${theme.name}">
                        <div class="theme-preview" style="background: ${theme.colors.primary}"></div>
                        <span>${theme.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // 插入到主题切换按钮旁边
        const themeToggleContainer = document.querySelector('.theme-toggle-container');
        if (themeToggleContainer) {
            themeToggleContainer.appendChild(selector);
        } else {
            document.body.appendChild(selector);
        }

        // 绑定事件
        this.bindThemeSelectorEvents(selector);
    }

    bindThemeSelectorEvents(selector) {
        const btn = selector.querySelector('.theme-selector-btn');
        const options = selector.querySelector('.theme-options');
        const themeOptions = selector.querySelectorAll('.theme-option');

        // 切换选项显示/隐藏
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            options.classList.toggle('show');
        });

        // 点击其他地方关闭选项
        document.addEventListener('click', () => {
            options.classList.remove('show');
        });

        // 主题选择事件
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeKey = option.dataset.theme;
                this.applyTheme(themeKey, this.currentMode);
                options.classList.remove('show');
                
                // 更新选中状态
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // 设置当前活跃主题
        const currentOption = selector.querySelector(`[data-theme="${this.currentColorTheme}"]`);
        if (currentOption) {
            currentOption.classList.add('active');
        }
    }

    bindModeToggle() {
        const modeToggle = document.getElementById('theme-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('click', () => {
                const newMode = this.currentMode === 'dark' ? 'light' : 'dark';
                this.applyTheme(this.currentColorTheme, newMode);
            });
        }
    }

    dispatchThemeChangeEvent(colorTheme, mode) {
        document.dispatchEvent(new CustomEvent('themeColorChanged', {
            detail: { colorTheme, mode, theme: this.themes[colorTheme] }
        }));
    }

    applyDefaultTheme() {
        // 降级方案：应用内置的基础主题
        this.applyTheme('klein', 'light');
    }

    // 公共API方法
    switchColorTheme(themeKey) {
        if (this.themes[themeKey]) {
            this.applyTheme(themeKey, this.currentMode);
            return true;
        }
        return false;
    }

    switchMode(mode) {
        if (mode === 'light' || mode === 'dark') {
            this.applyTheme(this.currentColorTheme, mode);
            return true;
        }
        return false;
    }

    getCurrentTheme() {
        return {
            colorTheme: this.currentColorTheme,
            mode: this.currentMode,
            theme: this.themes[this.currentColorTheme]
        };
    }

    getAvailableThemes() {
        return Object.keys(this.themes);
    }
}

// 全局初始化
let themeColorManager;

document.addEventListener('DOMContentLoaded', () => {
    themeColorManager = new ThemeColorManager();
    window.themeColorManager = themeColorManager;
});

// 兼容性处理
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.themeColorManager) {
            themeColorManager = new ThemeColorManager();
            window.themeColorManager = themeColorManager;
        }
    });
} else {
    themeColorManager = new ThemeColorManager();
    window.themeColorManager = themeColorManager;
}
