# Component Specifications from Supernova

## 📦 What You Have

### 1. **Design Tokens** (484 tokens from Supernova)
- Colors, spacing, typography, etc.
- Location: `src/styles/tokens/`
- Usage: Already integrated into your app!

### 2. **Component List** (21 components from Supernova)
- Button, Checkbox, Input, Avatar, Alert Banner, etc.
- Location: `src/components/specs/`
- Includes: Descriptions, properties, status

### 3. **Component Guidelines** (Design specifications)
- Sizes, colors, spacing rules
- Location: `src/components/specs/component-guidelines.ts`
- Use this to build components that match your design system

## 🎯 How to Use Component Specs

### Option 1: Build Components from Guidelines

Use the `component-guidelines.ts` file as your source of truth:

```typescript
import { ComponentGuidelines } from './components/specs/component-guidelines';

// Button sizes
const buttonSize = ComponentGuidelines.Button.sizes.medium;
// { height: '40px', paddingX: '16px', paddingY: '8px', fontSize: '16px' }

// Input states
const inputFocus = ComponentGuidelines.Input.states.focus;
// { borderColor: '#0066cc', boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)' }
```

### Option 2: Map Supernova Tokens to Components

Update `component-guidelines.ts` to use your actual Supernova tokens:

```typescript
// Instead of hardcoded colors:
background: '#0066cc'

// Use your Supernova tokens:
background: DesignTokens.color_primary
```

### Option 3: Create Angular Components

Example Button component:

```typescript
import { Component, Input } from '@angular/core';
import { ComponentGuidelines, ComponentSize } from './specs/component-guidelines';

@Component({
  selector: 'app-button',
  template: `
    <button 
      [class]="'btn btn-' + variant + ' btn-' + size"
      [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() size: ComponentSize = 'medium';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() disabled = false;
}
```

## 🔧 Syncing Component Variants from Figma

Your components currently don't have variants (Small, Medium, Large) synced from Figma.

### To Sync Component Variants:

1. **In Supernova:**
   - Go to your design system
   - Navigate to Components section
   - Click "Sync from Figma" or your design tool
   - Ensure component variants are properly imported

2. **In Figma:**
   - Make sure components are published as variants
   - Use consistent naming (e.g., Button/Primary, Button/Secondary)
   - Components should have properties defined

3. **Re-fetch:**
   ```bash
   npm run fetch-components
   ```

## 🎨 Component Specifications Available

### Buttons
- **Sizes**: Small (32px), Medium (40px), Large (48px)
- **Variants**: Primary, Secondary, Outline
- **States**: Default, Hover, Active, Disabled

### Input Fields
- **Sizes**: Small (32px), Medium (40px), Large (48px)
- **Label**: Required, 14px uppercase with 600 weight
- **States**: Default, Focus, Error, Disabled
- **Colors**: Use tokens for border, background, focus

### Checkboxes
- **Sizes**: Small (16px), Medium (20px), Large (24px)
- **States**: Unchecked, Checked, Disabled
- **Label**: 14px, 8px margin-left

### Avatars
- **Sizes**: XS (24px), Small (32px), Medium (40px), Large (56px), XL (96px)
- **Shapes**: Square, Rounded, Circle

### Alert Banners
- **Variants**: Info (blue), Success (green), Warning (yellow), Error (red)
- **Padding**: 16px
- **Border**: 1px solid with matching colors

## 📋 Next Steps

### 1. **Build Components**
Create Angular components based on the guidelines:
```bash
ng generate component components/button
ng generate component components/input
ng generate component components/checkbox
```

### 2. **Style with Tokens**
Use your Supernova tokens in component SCSS:
```scss
@use '../../styles/tokens/token-aliases' as *;

.button {
  background: $color-primary;
  padding: $spacing-md;
  border-radius: $border-radius-md;
}
```

### 3. **Add TypeScript Types**
Use the component specs for type safety:
```typescript
import { ComponentGuidelines } from './specs/component-guidelines';

type ButtonSize = keyof typeof ComponentGuidelines.Button.sizes;
```

### 4. **(Optional) Add Storybook**
For visual component documentation and testing:
```bash
npx storybook init
```

## 🔄 Keeping Components in Sync

Run these commands to update from Supernova:

```bash
# Update tokens only
npm run fetch-tokens

# Update component specs only
npm run fetch-components

# Update everything
npm run fetch-all
```

## 📚 Files Reference

- `src/styles/tokens/_tokens.scss` - All Supernova tokens (auto-generated)
- `src/styles/tokens/_token-aliases.scss` - Semantic token mappings (customize!)
- `src/components/specs/components.json` - Component metadata
- `src/components/specs/component-guidelines.ts` - Design specifications
- `src/components/specs/COMPONENTS.md` - Documentation

## 💡 Pro Tips

1. **Start with token-aliases.scss**: Map your Supernova tokens to semantic names
2. **Use component-guidelines.ts**: Reference for sizes, spacing, colors
3. **Keep specs up to date**: Run `npm run fetch-all` regularly
4. **Build components incrementally**: Start with most-used components first
5. **Document as you go**: Update guidelines based on implementation decisions

## 🤝 Storybook vs. Supernova

**Supernova** = Source of truth (design specs, tokens)
**Storybook** = Documentation & testing of built components

They work together:
1. Design in Figma
2. Sync to Supernova (specs & tokens)
3. Build Angular components
4. Document in Storybook (optional)

Both are valuable but serve different purposes!


