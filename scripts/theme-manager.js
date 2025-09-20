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
        
        // 链接颜色变量 - 根据模式优化对比度和舒适度
        if (mode === 'dark') {
            // 深色模式下使用温和的暖色调，避免蓝色
            const gentleColor = this.getGentleDarkModeColor(colors.primary);
            root.style.setProperty('--blue-accent', gentleColor);
            root.style.setProperty('--blue-hover', this.adjustColorBrightness(gentleColor, 1.1));
            // 为头部名字设置专门的暖色调变量
            root.style.setProperty('--name-color', gentleColor);
            // 装饰条也使用暖色调，保持统一
            root.style.setProperty('--section-accent', gentleColor);
        } else {
            // 浅色模式下保持原来的蓝色
            const linkColor = this.ensureContrastRatio(colors.primary, '#ffffff', 4.5);
            root.style.setProperty('--blue-accent', linkColor);
            root.style.setProperty('--blue-hover', colors.primaryHover);
            // 浅色模式下名字也使用蓝色
            root.style.setProperty('--name-color', linkColor);
            // 装饰条使用主题蓝色
            root.style.setProperty('--section-accent', colors.primary);
        }
        
        // 高亮颜色
        root.style.setProperty('--highlight-bg-soft', colors.highlight);
        
        // 渐变效果
        if (mode === 'dark') {
            // 深色模式下名字使用暖色调渐变
            const nameColor = this.getGentleDarkModeColor(colors.primary);
            const nameColorLight = this.adjustColorBrightness(nameColor, 1.2);
            root.style.setProperty('--gradient-primary', 
                `linear-gradient(135deg, ${nameColor} 0%, ${nameColorLight} 100%)`);
        } else {
            // 浅色模式下保持原来的蓝色渐变
            root.style.setProperty('--gradient-primary', 
                `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`);
        }
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
        root.style.setProperty('--text-light', '#9ca3af');
        root.style.setProperty('--border-color', '#e5e7eb');
        root.style.setProperty('--border-light', '#f3f4f6');
        root.style.setProperty('--blue-light', '#f1f5f9');
        
        // 浅色模式的阴影效果
        root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.03)');
        root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)');
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)');
        root.style.setProperty('--shadow-colored', `0 4px 14px 0 ${colors.primary}20`); // 20% opacity
    }

    setDarkModeColors(colors) {
        const root = document.documentElement;
        
        // 深色模式的背景和文字颜色 - 改进对比度
        root.style.setProperty('--bg-primary', '#0f1419');      // 更深的背景
        root.style.setProperty('--bg-secondary', '#1a202c');    // 更深的次要背景
        root.style.setProperty('--bg-tertiary', '#2d3748');     // 更深的第三级背景
        root.style.setProperty('--text-primary', '#ffffff');    // 纯白文字，最高对比度
        root.style.setProperty('--text-secondary', '#f7fafc');  // 接近纯白的次要文字
        root.style.setProperty('--text-muted', '#e2e8f0');      // 更亮的静默文字
        root.style.setProperty('--text-light', '#cbd5e0');      // 更亮的轻文字
        root.style.setProperty('--border-color', '#4a5568');    // 更明显的边框
        root.style.setProperty('--border-light', '#2d3748');    // 浅边框
        root.style.setProperty('--blue-light', '#2a4365');
        
        // 深色模式的高亮颜色调整
        const highlightColor = this.adjustColorForDarkMode(colors.highlight);
        root.style.setProperty('--highlight-bg-soft', highlightColor);
        
        // 深色模式的高亮渐变效果
        const darkHighlightGradient = this.getDarkModeHighlightGradient(colors);
        root.style.setProperty('--highlight-soft', darkHighlightGradient);
        
        // 深色模式的阴影效果增强
        root.style.setProperty('--shadow-sm', '0 2px 4px 0 rgb(0 0 0 / 0.6)');
        root.style.setProperty('--shadow-md', '0 6px 12px -2px rgb(0 0 0 / 0.8), 0 4px 8px -4px rgb(0 0 0 / 0.8)');
        root.style.setProperty('--shadow-lg', '0 20px 25px -5px rgb(0 0 0 / 0.9), 0 10px 15px -8px rgb(0 0 0 / 0.9)');
        root.style.setProperty('--shadow-colored', `0 6px 20px 0 ${colors.primary}40`); // 40% opacity
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
        // 为深色模式生成合适的高亮渐变 - 增强亮度
        const darkPrimary = this.adjustColorBrightness(colors.primary, 1.4);      // 增加亮度
        const darkPrimaryLight = this.adjustColorBrightness(colors.primaryLight, 1.2);
        const darkHighlightBorder = this.adjustColorBrightness(colors.highlightBorder, 1.3);
        
        return `linear-gradient(135deg, ${darkHighlightBorder} 0%, ${darkPrimary} 50%, ${darkPrimaryLight} 100%)`;
    }

    adjustColorBrightness(hexColor, factor) {
        // 将十六进制颜色转换为RGB并调整亮度
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // 调整亮度，确保不超出0-255范围
        const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
        const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
        const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
        
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    ensureContrastRatio(foregroundColor, backgroundColor, minRatio) {
        // 确保前景色与背景色有足够的对比度
        const fgLuminance = this.getLuminance(foregroundColor);
        const bgLuminance = this.getLuminance(backgroundColor);
        const currentRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
        
        if (currentRatio >= minRatio) {
            return foregroundColor;
        }
        
        // 如果对比度不够，调暗颜色
        let factor = 0.8;
        let adjustedColor = foregroundColor;
        
        while (factor > 0.3) {
            adjustedColor = this.adjustColorBrightness(foregroundColor, factor);
            const adjustedLuminance = this.getLuminance(adjustedColor);
            const newRatio = (Math.max(adjustedLuminance, bgLuminance) + 0.05) / (Math.min(adjustedLuminance, bgLuminance) + 0.05);
            
            if (newRatio >= minRatio) {
                return adjustedColor;
            }
            factor -= 0.1;
        }
        
        // 如果还是不够，返回一个深色的安全颜色
        return backgroundColor === '#ffffff' ? '#1a365d' : foregroundColor;
    }

    getLuminance(hexColor) {
        // 计算颜色的相对亮度
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        
        return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    }

    getGentleDarkModeColor(primaryColor) {
        // 为深色模式生成温和的、对眼睛友好的非蓝色字体颜色
        const colorMap = {
            // Klein Blue -> 温和的暖色调，避免蓝色
            '#002fa7': '#fbbf24',  // 温暖的金黄色，与蓝色形成互补
            // 其他蓝色系 -> 暖色调
            '#1e40af': '#f59e0b',  // 琥珀色
            '#2563eb': '#d97706',  // 橙色
            // 绿色系 -> 保持绿色但更温和
            '#407d52': '#86efac',  // 温和的浅绿色
            '#059669': '#6ee7b7',  // 浅绿色
            // 紫色系 -> 温和的紫色
            '#7c3aed': '#c4b5fd',  // 浅紫色
            // 红色系 -> 温和的红色
            '#dc2626': '#fca5a5',  // 浅红色
            // 青蓝色系 -> 暖青色
            '#0d9488': '#5eead4',  // 浅青色
            // 橙色系 -> 保持橙色
            '#ea580c': '#fdba74'   // 浅橙色
        };
        
        // 如果有预设的温和色彩，使用它
        if (colorMap[primaryColor]) {
            return colorMap[primaryColor];
        }
        
        // 否则通过算法生成温和的颜色
        return this.generateGentleColor(primaryColor);
    }

    getLightModeWarmColor(primaryColor) {
        // 为浅色模式生成温和的暖色调，避免蓝色
        const colorMap = {
            // Klein Blue -> 深色暖色调，确保在白色背景上有足够对比度
            '#002fa7': '#d97706',  // 深琥珀色，与蓝色背景形成对比
            // 其他蓝色系 -> 深暖色调
            '#1e40af': '#dc2626',  // 深红色
            '#2563eb': '#ea580c',  // 深橙色
            // 绿色系 -> 保持绿色但更深
            '#407d52': '#059669',  // 深绿色
            '#059669': '#047857',  // 更深的绿色
            // 紫色系 -> 深紫色
            '#7c3aed': '#7c2d12',  // 深棕紫色
            // 红色系 -> 深红色
            '#dc2626': '#991b1b',  // 深红色
            // 青蓝色系 -> 深青色
            '#0d9488': '#0f766e',  // 深青色
            // 橙色系 -> 深橙色
            '#ea580c': '#c2410c'   // 深橙色
        };
        
        // 如果有预设的暖色调，使用它
        if (colorMap[primaryColor]) {
            return colorMap[primaryColor];
        }
        
        // 否则生成一个深色的暖色调
        return this.generateWarmColor(primaryColor);
    }

    generateWarmColor(hexColor) {
        // 生成暖色调：向红/橙/黄方向偏移
        const hex = hexColor.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // 转换为HSL进行调整
        const hsl = this.rgbToHsl(r, g, b);
        
        // 调整色相到暖色调范围 (红-橙-黄: 0-60度)
        if (hsl[0] > 0.5) {
            // 如果是冷色调，转换到暖色调
            hsl[0] = 0.08 + (hsl[0] - 0.5) * 0.1; // 转到橙色范围
        } else if (hsl[0] > 0.16) {
            // 如果不在暖色范围，调整到暖色
            hsl[0] = Math.min(0.16, hsl[0]); // 限制在暖色范围内
        }
        
        // 确保足够的饱和度和适中的亮度
        hsl[1] = Math.max(0.6, hsl[1]); // 保持较高饱和度
        hsl[2] = Math.max(0.3, Math.min(0.5, hsl[2])); // 适中的亮度，确保对比度
        
        // 转换回RGB
        const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
        
        return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
    }

    generateGentleColor(hexColor) {
        // 算法生成温和的颜色：提高亮度，降低饱和度
        const hex = hexColor.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // 转换为HSL进行调整
        const hsl = this.rgbToHsl(r, g, b);
        
        // 调整参数：提高亮度到70-80%，降低饱和度到60-70%
        hsl[1] = Math.min(0.7, hsl[1] * 0.8);  // 降低饱和度
        hsl[2] = Math.max(0.7, Math.min(0.85, hsl[2] + 0.4)); // 提高亮度
        
        // 转换回RGB
        const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
        
        return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [h, s, l];
    }

    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r * 255, g * 255, b * 255];
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
