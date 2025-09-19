# 🎨 主题配置系统使用指南

你的个人主页现在支持通过配置文件快速切换主题颜色！这个系统让你可以轻松地自定义和切换不同的颜色主题。

## ✨ 功能特点

- 🎯 **配置文件驱动**: 通过 `themes.json` 文件管理所有主题
- 🔄 **实时切换**: 无需刷新页面即可切换主题
- 🌙 **深浅模式**: 每个主题都支持日间和夜间模式
- 💾 **状态保存**: 自动记住用户的主题选择
- 📱 **响应式**: 在所有设备上都有良好的体验
- 🎨 **可视化选择**: 直观的颜色预览和选择界面

## 🚀 如何使用

### 1. 切换现有主题

点击页面右上角的调色板图标（🎨），选择你喜欢的主题：

- **经典蓝色** - 学术专业的深蓝色主题（默认）
- **自然绿色** - 清新自然的绿色主题
- **优雅紫色** - 高雅的紫色学术主题
- **活力红色** - 充满活力的红色主题
- **青蓝色** - 现代科技感的青蓝色主题
- **温暖橙色** - 温暖友好的橙色主题

### 2. 日夜模式切换

使用右上角的太阳/月亮图标在日间和夜间模式之间切换。

## 🛠️ 自定义主题

### 创建新主题

1. **编辑配置文件**: 打开 `themes.json` 文件
2. **添加新主题**: 在 `themes` 对象中添加你的主题配置
3. **保存刷新**: 保存文件后刷新页面

### 主题配置格式

```json
{
  "themes": {
    "your-theme-name": {
      "name": "显示名称",
      "description": "主题描述",
      "colors": {
        "primary": "#主色调",
        "primaryHover": "#主色调悬停态",
        "primaryLight": "#主色调浅色版本",
        "accent": "#强调色",
        "accentHover": "#强调色悬停态", 
        "accentLight": "#强调色浅色版本",
        "highlight": "#高亮背景色",
        "highlightBorder": "#高亮边框色"
      }
    }
  }
}
```

### 颜色说明

| 颜色变量 | 用途 | 示例 |
|---------|------|------|
| `primary` | 主色调，用于标题、链接等主要元素 | `#1e40af` |
| `primaryHover` | 鼠标悬停时的主色调 | `#1d4ed8` |
| `primaryLight` | 主色调的浅色版本，用于背景等 | `#2563eb` |
| `accent` | 强调色，用于次要元素 | `#64748b` |
| `accentHover` | 强调色的悬停态 | `#475569` |
| `accentLight` | 强调色的浅色版本 | `#e2e8f0` |
| `highlight` | 文字高亮的背景色 | `#fef3c7` |
| `highlightBorder` | 高亮元素的边框色 | `#f59e0b` |

## 🎨 设计建议

### 颜色选择

1. **主色调选择**: 选择一个代表你个人风格的主色调
2. **对比度**: 确保颜色有足够的对比度保证可读性
3. **和谐搭配**: 使用色彩理论选择和谐的颜色组合
4. **品牌一致性**: 如果你有个人品牌色彩，可以使用相应颜色

### 推荐工具

- **Adobe Color**: https://color.adobe.com/
- **Coolors**: https://coolors.co/
- **Material Design Colors**: https://materialui.co/colors/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

## 🔧 技术细节

### 文件结构

```
├── themes.json                 # 主题配置文件
├── theme-config-example.json   # 配置示例文件
├── scripts/
│   ├── functions.js            # 原有功能脚本
│   └── theme-manager.js        # 主题管理器
└── stylesheet.css              # 样式文件（支持CSS变量）
```

### API 接口

主题管理器提供以下JavaScript API：

```javascript
// 获取主题管理器实例
const manager = window.themeColorManager;

// 切换颜色主题
manager.switchColorTheme('green');

// 切换日夜模式
manager.switchMode('dark');

// 获取当前主题信息
const current = manager.getCurrentTheme();

// 获取所有可用主题
const themes = manager.getAvailableThemes();
```

### 事件监听

你可以监听主题变更事件：

```javascript
document.addEventListener('themeColorChanged', (event) => {
    const { colorTheme, mode, theme } = event.detail;
    console.log(`主题已切换至: ${colorTheme} (${mode})`);
});
```

## 🐛 故障排除

### 常见问题

1. **主题不生效**: 检查 `themes.json` 文件格式是否正确
2. **颜色显示异常**: 确保颜色代码格式正确（使用十六进制格式如 `#1e40af`）
3. **选择器不显示**: 检查浏览器控制台是否有JavaScript错误

### 降级方案

如果主题系统出现问题，系统会自动降级到默认的蓝色主题，确保网站正常运行。

## 📝 更新日志

- **v1.0**: 初始版本，支持6种预设主题和配置文件自定义
- 支持日夜模式自动适配
- 添加可视化主题选择器
- 实现主题状态持久化保存

## 🤝 贡献

如果你创建了好看的主题配色，欢迎分享！你可以：

1. 将你的主题配置添加到 `themes.json`
2. 在社交媒体上分享你的配色方案
3. 为其他用户提供配色建议

---

🎉 **享受你的个性化主题体验！** 如果有任何问题或建议，随时反馈。
