# Task Screen

A blank Angular prototype ready for your design system implementation.

## 🚀 Getting Started

This prototype was created from the template and is ready to use!

### Development

```bash
# From the root of the monorepo
npm run dev -w @prototypes/task-screen

# Or from this directory
npm run dev
```

Your app will be available at: http://localhost:4100

## 📁 Structure

```
src/
├── app/
│   ├── app.ts         # Main component logic
│   ├── app.html       # Main component template
│   ├── app.scss       # Main component styles
│   └── app.config.ts  # App configuration
├── main.ts            # Application bootstrap
├── index.html         # HTML entry point
└── styles.scss        # Global styles
```

## 🎨 Using Supernova Design Tokens

### In TypeScript/JavaScript

```typescript
import { DesignTokens } from '@prototypes/supernova-sdk/output/tokens/tokens';

// Use tokens
const primaryColor = DesignTokens.color_primary;
```

### In SCSS

```scss
@import '@prototypes/supernova-sdk/output/tokens/tokens';

.my-component {
  background: $color-primary;
  padding: $spacing-md;
}
```

## 🧩 Creating Components

Create new components in the `src/app/` directory:

```bash
# Example component structure
src/app/
└── my-component/
    ├── my-component.ts
    ├── my-component.html
    └── my-component.scss
```

## 📦 Building

```bash
npm run build
```

## 🧪 Testing

```bash
npm test
```

## 📚 Learn More

- [Angular Documentation](https://angular.dev)
- [Supernova Documentation](https://learn.supernova.io/)
- [Project README](../../README.md)

---

Happy prototyping! 🎨✨

