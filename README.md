# tailwind-plugin-current-color-utils
> 🎨 Enhanced currentColor support for TailwindCSS

## 📦 What's included
### 5 new colors:
| Color | Description |
| --- | --- |
| `current` | Current text color |
| `current-inverted` | Current text color (inverted) |
| `current-contrast` | Optimal contrast color (black or white) |
| `current-contrast-inverted` | Inverted color of *current-contrast* |
| `current!` | Native *currentColor* |

### Variable setters on each existing color:
```css
.text-dark {
  --tw-text-opacity: 1;
  color: rgb(39 34 66 / var(--tw-text-opacity));
  
  /* Injected variables */
  --cc-current-color: 39 34 66;
  --cc-current-color-inverted: 216 221 189;
  --cc-current-color-contrast: 255 255 255;
  --cc-current-color-contrast-inverted: 0 0 0;
}
```

> Tip: This plugin supports use of `text-current` with `text-opacity-*`. See example below.

## 🚀 Get started
### Tailwind config:
```js
module.exports = {
  // ...
  plugins: [
    require('tailwind-config-current-color-utils'),
  ]
}
```

### Example usage:
```html
<body class="text-gray-700 dark:text-gray-300">
  <!-- "dark:" variant will affect all current-* colors inside -->
    <div class="text-current text-opacity-50 bg-current-contrast">
      <!--
        - Semi-transparent text (text-opacity-50)
        - Dark text on white background (light mode)
        - Light text on black background (dark mode)
      -->
    </div>
</body>
```

## ⚙️ Plugin options
```js
module.exports = {
  // ...
  plugins: [
    require('tailwind-config-current-color-utils')({
      // Customize contrast colors
      contrastColors: ['#000', '#FFF'],
    }),
  ]
}
```