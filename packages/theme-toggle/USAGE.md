# Quick Start Guide: Adding Theme Toggle to Your Prototype

Follow these 3 simple steps to add light/dark mode switching to any prototype.

## Step 1: Update `tsconfig.json`

Add the path mapping to your prototype's `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... other options
    "paths": {
      "@prototypes/theme-toggle": ["../../packages/theme-toggle/index.ts"]
    }
  }
}
```

## Step 2: Import the Component

In your `app.ts` (or main component):

```typescript
import { Component } from '@angular/core';
import { ThemeToggleComponent } from '@prototypes/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent], // Add here
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Your component code
}
```

## Step 3: Add to Template

In your `app.html`:

```html
<div class="container">
  <!-- Add this line -->
  <theme-toggle></theme-toggle>
  
  <!-- Your other content -->
</div>
```

## Step 4: Style for Dark Mode

In your `app.scss`, add dark theme styles:

```scss
.container {
  background: white;
  color: #202020;
}

// Dark theme styles
:host-context(.dark-theme) {
  .container {
    background: #1a1a1a;
    color: #ffffff;
  }
  
  // Style other elements for dark mode
  .my-component {
    background: #2a2a2a;
    color: #b0b0b0;
  }
}
```

## That's it!

The toggle will automatically appear in the top-left corner and handle theme switching for you.

---

## Common Dark Mode Color Palette

For consistency across prototypes, use these colors:

### Backgrounds
- Light mode: `#ffffff` (white)
- Dark mode: `#1a1a1a` (very dark gray)
- Dark mode secondary: `#2a2a2a` (dark gray)

### Text
- Light mode primary: `#202020` (almost black)
- Light mode secondary: `#646464` (medium gray)
- Dark mode primary: `#ffffff` (white)
- Dark mode secondary: `#b0b0b0` (light gray)

### Hover States
- Light mode: `rgba(0, 0, 0, 0.04)`
- Dark mode: `rgba(255, 255, 255, 0.08)`

## Example: Complete Dark Mode Implementation

```scss
// Light mode (default)
.toast {
  background: #ffffff;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.27);
}

.toast-title {
  color: #202020;
}

.toast-message {
  color: #646464;
}

// Dark mode
:host-context(.dark-theme) {
  .toast {
    background: #2a2a2a;
    box-shadow: 0px 0px 1px 0px rgba(255, 255, 255, 0.15);
    
    .toast-title {
      color: #ffffff !important;
    }
    
    .toast-message {
      color: #b0b0b0 !important;
    }
  }
}
```

**Tip:** Use `!important` for nested styles inside the dark theme block to ensure they override base styles.


