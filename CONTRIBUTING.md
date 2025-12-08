# Contributing to Supernova Prototypes

Thank you for contributing! This guide will help you add new prototypes and collaborate effectively.

## 🚀 Quick Start for New Prototypes

### 1. Set Up Your Environment

```bash
# Clone and install
git clone <repo-url>
cd "Supernova test"
npm install

# Configure Supernova (if not already done)
cd packages/supernova-sdk
cp .env.example .env
# Edit .env with your credentials
npm run fetch-all
cd ../..
```

### 2. Create Your Prototype

Choose your framework and follow the template:

#### Option A: Start from Scratch

```bash
# Create your app directory
mkdir apps/my-prototype
cd apps/my-prototype

# Initialize with your framework
# React
npx create-react-app . --template typescript

# Vue
npm create vite@latest . -- --template vue-ts

# Svelte
npm create vite@latest . -- --template svelte-ts

# Or any other framework!
```

#### Option B: Copy the Template

```bash
cp -r apps/.template apps/my-prototype
cd apps/my-prototype
npm install
```

### 3. Configure Your Package

Edit `package.json`:

```json
{
  "name": "@supernova-test/my-prototype",
  "version": "1.0.0",
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "test": "your-test-command"
  },
  "dependencies": {
    "@supernova-test/supernova-sdk": "*"
  }
}
```

### 4. Integrate Design System

Use the shared Supernova data:

```typescript
// Import design tokens
import { DesignTokens } from '@supernova-test/supernova-sdk/output/tokens/tokens';

// Import assets
import { SupernovaAssets } from '@supernova-test/supernova-sdk/output/assets/assets';

// Use in your code
const primaryColor = DesignTokens.color_primary;
const iconPath = SupernovaAssets['icon-name'];
```

### 5. Add to Gallery

Edit `apps/gallery/prototypes.json`:

```json
{
  "id": "my-prototype",
  "name": "My Framework Prototype",
  "icon": "🎯",
  "framework": "Your Framework",
  "description": "Brief description of your implementation",
  "url": "http://localhost:YOUR_PORT",
  "port": YOUR_PORT,
  "status": "active",
  "author": "Your Name",
  "lastUpdated": "2025-12-08",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

### 6. Test Your Work

```bash
# Install all dependencies
npm install

# Run your prototype
npm run dev -w @supernova-test/my-prototype

# Check the gallery
npm run gallery
# Visit http://localhost:3000
```

### 7. Commit and Share

```bash
git add .
git commit -m "Add [framework] prototype"
git push origin main
```

## 📋 Best Practices

### Code Style

- Follow your framework's best practices
- Use TypeScript when possible
- Keep components small and focused
- Comment complex logic

### Design System Integration

- ✅ **DO**: Use design tokens from `@supernova-test/supernova-sdk`
- ✅ **DO**: Reference shared assets
- ✅ **DO**: Follow component specifications
- ❌ **DON'T**: Hard-code colors, spacing, or other design values
- ❌ **DON'T**: Duplicate Supernova scripts in your app

### Documentation

- Add a README.md to your prototype folder
- Document any special setup steps
- Include screenshots or GIFs
- List any unique dependencies

### Testing

- Write tests for your components
- Ensure your prototype builds successfully
- Test responsive behavior
- Verify accessibility

## 🎨 Working with Supernova

### Syncing Design System Updates

```bash
# Fetch latest tokens, components, and assets
npm run fetch-supernova

# Or fetch individually
cd packages/supernova-sdk
npm run fetch-tokens
npm run fetch-components
npm run fetch-assets
```

### Using Design Tokens

**In CSS/SCSS:**
```scss
@import '@supernova-test/supernova-sdk/output/tokens/tokens';

.my-component {
  color: $color-primary;
  padding: $spacing-md;
  border-radius: $border-radius-sm;
}
```

**In JavaScript/TypeScript:**
```typescript
import { DesignTokens } from '@supernova-test/supernova-sdk/output/tokens/tokens';

const styles = {
  color: DesignTokens.color_primary,
  padding: DesignTokens.spacing_md,
};
```

**In CSS-in-JS:**
```typescript
const Button = styled.button`
  color: ${DesignTokens.color_primary};
  padding: ${DesignTokens.spacing_md};
`;
```

## 🐛 Troubleshooting

### My prototype doesn't show in the gallery

1. Check `apps/gallery/prototypes.json` has your entry
2. Ensure your prototype is running on the specified port
3. Refresh the gallery page

### Can't import from @supernova-test/supernova-sdk

1. Run `npm install` at the root level
2. Check your prototype's `package.json` has the dependency
3. Try `rm -rf node_modules && npm install`

### Design tokens not updating

1. Run `npm run fetch-supernova` to get latest data
2. Restart your development server
3. Clear your build cache

## 📞 Getting Help

- Check the main [README.md](./README.md)
- Review existing prototypes in `apps/`
- Ask the team in [your communication channel]

## 🎯 Prototype Checklist

Before considering your prototype complete:

- [ ] Package name follows `@supernova-test/[name]` convention
- [ ] Has `dev`, `build`, and `test` scripts
- [ ] Uses shared design tokens (no hard-coded values)
- [ ] Added to `apps/gallery/prototypes.json`
- [ ] Includes a README.md with setup instructions
- [ ] Successfully builds without errors
- [ ] Runs on a unique port
- [ ] Responsive on mobile and desktop
- [ ] Committed and pushed to repository

## 🌟 Ideas for Prototypes

Not sure what to build? Try:

- **Framework Comparison**: Same UI in different frameworks
- **Component Library**: Showcase all design system components
- **Pattern Library**: Common UI patterns (forms, modals, navigation)
- **Accessibility Demo**: Demonstrate accessible implementations
- **Animation Showcase**: Show motion design principles
- **Responsive Layouts**: Demonstrate responsive patterns
- **Dark Mode**: Implement theme switching
- **Micro-interactions**: Showcase subtle interactions

Happy building! 🚀
