# 🎨 Theme Configuration System Guide

Your personal homepage now supports theme switching driven by a configuration file. The system makes it easy to customize and toggle between color themes.

## ✨ Highlights

- 🎯 **Configuration-driven**: Manage themes via `themes.json`
- 🔄 **Live switching**: Swap themes without refreshing the page
- 🌙 **Light & dark modes**: Every theme supports day and night variants
- 💾 **State persistence**: Automatically remember the chosen theme
- 📱 **Responsive**: Great experience across devices
- 🎨 **Visual picker**: Intuitive color preview and selection UI

## 🚀 Getting Started

### 1. Switch an existing theme

Click the palette icon (🎨) in the top-right corner and pick a theme:

- **Classic Blue** – Professional deep blue (default)
- **Natural Green** – Fresh, nature-inspired green
- **Elegant Purple** – Sophisticated academic purple
- **Vibrant Red** – Energetic and bold red
- **Cyan Blue** – Tech-forward cyan theme
- **Warm Orange** – Friendly orange palette

### 2. Toggle light/dark mode

Use the sun/moon icon in the top-right corner to switch between day and night modes.

## 🛠️ Customize Themes

### Create a new theme

1. **Edit the config**: Open `themes.json`
2. **Add a theme**: Append your theme definition under the `themes` object
3. **Save & reload**: Save the file, then refresh the page

### Theme configuration format

```json
{
  "themes": {
    "your-theme-name": {
      "name": "Display Name",
      "description": "Theme description",
      "colors": {
        "primary": "#primary-color",
        "primaryHover": "#primary-hover-color",
        "primaryLight": "#primary-light-color",
        "accent": "#accent-color",
        "accentHover": "#accent-hover-color",
        "accentLight": "#accent-light-color",
        "highlight": "#highlight-background",
        "highlightBorder": "#highlight-border"
      }
    }
  }
}
```

### Color reference

| Color variable | Usage | Example |
|---------|------|------|
| `primary` | Main color for headings, links, key elements | `#1e40af` |
| `primaryHover` | Hover state for primary elements | `#1d4ed8` |
| `primaryLight` | Light variant for backgrounds | `#2563eb` |
| `accent` | Accent color for secondary elements | `#64748b` |
| `accentHover` | Hover state for accents | `#475569` |
| `accentLight` | Light version of accent color | `#e2e8f0` |
| `highlight` | Background for highlighted text | `#fef3c7` |
| `highlightBorder` | Border for highlight blocks | `#f59e0b` |

## 🎨 Design Tips

### Color selection

1. **Pick your base**: Choose a primary color that reflects your style
2. **Maintain contrast**: Ensure accessibility with enough contrast
3. **Stay harmonious**: Lean on color theory for balanced palettes
4. **Honor brand colors**: Use brand hues if you already have them

### Recommended tools

- **Adobe Color**: https://color.adobe.com/
- **Coolors**: https://coolors.co/
- **Material Design Colors**: https://materialui.co/colors/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

## 🔧 Technical Details

### File structure

```
├── themes.json                 # Theme configuration file
├── theme-config-example.json   # Example config
├── scripts/
│   ├── functions.js            # Existing feature script
│   └── theme-manager.js        # Theme manager
└── stylesheet.css              # Stylesheet with CSS variables
```

### API surface

The theme manager exposes the following JavaScript API:

```javascript
// Get the theme manager instance
const manager = window.themeColorManager;

// Switch to another color theme
manager.switchColorTheme('green');

// Toggle light or dark mode
manager.switchMode('dark');

// Retrieve current theme info
const current = manager.getCurrentTheme();

// List all themes
const themes = manager.getAvailableThemes();
```

### Event listeners

You can subscribe to the theme change event:

```javascript
document.addEventListener('themeColorChanged', (event) => {
    const { colorTheme, mode, theme } = event.detail;
    console.log(`Theme switched to: ${colorTheme} (${mode})`);
});
```

## 🐛 Troubleshooting

### Common issues

1. **Theme not applied**: Validate the structure of `themes.json`
2. **Color looks wrong**: Confirm colors use valid hex codes like `#1e40af`
3. **Picker missing**: Look for JavaScript errors in the browser console

### Fallback

If something goes wrong, the system automatically falls back to the default blue theme so the site remains usable.

## 📝 Changelog

- **v1.0**: Initial release with six presets and customizable config
- Added automatic light/dark handling
- Added visual theme picker
- Persisted user theme selection

## 🤝 Contributing

If you design a great color scheme, please share it:

1. Add your theme config to `themes.json`
2. Share your palette on social media
3. Suggest combinations to other users

---

🎉 **Enjoy your personalized theme experience!** Reach out any time with feedback or ideas.
