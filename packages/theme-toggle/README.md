# @prototypes/theme-toggle

A reusable Angular standalone component for light/dark mode theme switching across all prototypes.

## Features

- 🎨 Smooth theme transitions
- 🌓 Light and dark mode with SVG icons
- 📦 Standalone component (no NgModule required)
- 🎯 Fixed position in top-left corner
- ♿️ Accessible with aria-label
- 🎭 Automatic dark theme class on `<html>` element

## Installation

This package is part of the monorepo workspace and doesn't need separate installation.

## Usage

### 1. Import the Component

```typescript
import { Component } from '@angular/core';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent], // Add to imports
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Your component code
}
```

### 2. Add to Template

```html
<div class="container">
  <!-- Add theme toggle anywhere in your template -->
  <theme-toggle></theme-toggle>
  
  <!-- Your other content -->
</div>
```

### 3. Style Your Components for Dark Mode

The toggle automatically adds/removes the `dark-theme` class to the `<html>` element. Style your components accordingly:

```scss
.my-component {
  background: white;
  color: black;
}

// Dark theme styles
:host-context(.dark-theme) {
  .my-component {
    background: #1a1a1a;
    color: white;
  }
}
```

## API

### Component

- **Selector:** `theme-toggle`
- **Standalone:** Yes
- **Position:** Fixed at top-left (24px from top and left)

### Methods

- `toggleTheme()`: Toggles between light and dark mode
- `currentTheme`: Getter that returns `'light' | 'dark'`

## Styling

The component comes with default styles that match the Supernova design system:

- Icon size: 16x16px
- Button size: 32x32px
- Border radius: 7px
- Hover background: Semi-transparent overlay
- Colors: Follows design system tokens

You can override styles using standard CSS/SCSS if needed.

## Examples

### Basic Usage

```typescript
// app.ts
import { ThemeToggleComponent } from '@prototypes/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent],
  template: `
    <theme-toggle></theme-toggle>
    <div class="content">Your app content</div>
  `
})
export class App {}
```

### With Dark Mode Styles

```scss
// app.scss
.content {
  background: white;
  color: #202020;
  padding: 24px;
}

:host-context(.dark-theme) {
  .content {
    background: #1a1a1a;
    color: #ffffff;
  }
}
```

## Browser Support

Works in all modern browsers that support Angular 21+.

## License

Part of the Prototypes monorepo.


