# 🌟 Supernova Design System - Prototype Monorepo

A monorepo for creating and sharing design system prototypes across multiple frameworks, powered by [Supernova](https://www.supernova.io/).

## 📋 Overview

This monorepo enables teams to:
- 🎨 Share design tokens, components, and assets from Supernova
- 🚀 Create prototypes in any framework (Angular, React, Vue, Svelte, etc.)
- 📦 Maintain consistency across all implementations
- 🎯 Collaborate and showcase different approaches
- 📖 Browse all prototypes in a unified gallery

## 🏗️ Project Structure

```
Supernova test/
├── apps/                           # Application prototypes
│   ├── angular-prototype/          # Angular implementation
│   ├── gallery/                    # Gallery website
│   └── [your-framework-prototype]/ # Add more here!
│
├── packages/                       # Shared packages
│   └── supernova-sdk/              # Supernova integration utilities
│       ├── scripts/                # Fetch scripts
│       ├── output/                 # Generated tokens, components, assets
│       └── .env                    # Supernova credentials
│
├── package.json                    # Root workspace configuration
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 10+
- Supernova account with API access
- Your Supernova workspace and design system IDs

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Supernova test"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supernova credentials**
   ```bash
   cd packages/supernova-sdk
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   SUPERNOVA_API_TOKEN=your_api_token_here
   SUPERNOVA_WORKSPACE_ID=your_workspace_id_here
   SUPERNOVA_DESIGN_SYSTEM_ID=your_design_system_id_here
   ```

4. **Fetch design system data**
   ```bash
   npm run fetch-supernova
   ```

5. **Start the gallery**
   ```bash
   npm run gallery
   ```
   Visit http://localhost:3000

## 📦 Available Scripts

### Root Level

```bash
# Install all dependencies
npm install

# Fetch all Supernova data (tokens, components, assets)
npm run fetch-supernova

# Start all prototypes in development mode
npm run dev

# Build all prototypes
npm run build

# Run tests across all prototypes
npm run test

# Start the gallery
npm run gallery
```

### Working with Individual Apps

```bash
# Run a specific prototype
npm run dev -w @supernova-test/angular-prototype

# Build a specific app
npm run build -w @supernova-test/angular-prototype

# Run tests for a specific app
npm run test -w @supernova-test/angular-prototype
```

## 🎨 Working with Supernova

### Fetching Design System Updates

The `@supernova-test/supernova-sdk` package provides scripts to sync your design system:

```bash
# Fetch everything
npm run fetch-supernova

# Or fetch individually
cd packages/supernova-sdk
npm run fetch-tokens      # Design tokens → output/tokens/
npm run fetch-components  # Component specs → output/components/
npm run fetch-assets      # Icons & images → output/assets/
```

### Generated Files

After fetching, you'll have:

**Design Tokens:**
- `output/tokens/_tokens.scss` - SCSS variables
- `output/tokens/tokens.css` - CSS custom properties
- `output/tokens/tokens.ts` - TypeScript constants

**Components:**
- `output/components/components.json` - Component specifications
- `output/components/component-specs.ts` - TypeScript interfaces
- `output/components/COMPONENTS.md` - Documentation

**Assets:**
- `output/assets/*.svg` - Downloaded SVG icons
- `output/assets/assets-manifest.json` - Asset manifest
- `output/assets/assets.ts` - TypeScript helper

### Using Shared Data in Apps

Apps can reference the shared Supernova package:

```typescript
// In your app's TypeScript/JavaScript
import { DesignTokens } from '@supernova-test/supernova-sdk/output/tokens/tokens';
import { SupernovaAssets } from '@supernova-test/supernova-sdk/output/assets/assets';

// Use tokens
const primaryColor = DesignTokens.color_primary;

// Use assets
const iconPath = SupernovaAssets['icon-name'];
```

```scss
// In your app's SCSS
@import '@supernova-test/supernova-sdk/output/tokens/tokens';

.button {
  background: $color-primary;
  padding: $spacing-md;
}
```

## ➕ Adding a New Prototype

Want to create a prototype in your favorite framework? Here's how:

### Step 1: Create Your App

```bash
# Create a new directory in apps/
mkdir apps/my-framework-prototype
cd apps/my-framework-prototype

# Initialize your framework (example with React)
npx create-react-app . --template typescript
# or
npx create-vite . --template vue-ts
# or
ng new . --directory=. --skip-git
```

### Step 2: Configure Package

Update your `package.json`:

```json
{
  "name": "@supernova-test/my-framework-prototype",
  "version": "1.0.0",
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "test": "your-test-command"
  },
  "dependencies": {
    "@supernova-test/supernova-sdk": "*",
    // ... your framework dependencies
  }
}
```

### Step 3: Use Shared Supernova Data

Reference the shared design tokens, components, and assets:

```typescript
// Import tokens
import { DesignTokens } from '@supernova-test/supernova-sdk/output/tokens/tokens';

// Import assets
import { SupernovaAssets } from '@supernova-test/supernova-sdk/output/assets/assets';

// Use in your components
const theme = {
  primaryColor: DesignTokens.color_primary,
  spacing: DesignTokens.spacing_md,
};
```

### Step 4: Add to Gallery

Edit `apps/gallery/prototypes.json`:

```json
{
  "prototypes": [
    // ... existing prototypes
    {
      "id": "my-framework-prototype",
      "name": "My Framework Prototype",
      "icon": "⚛️",
      "framework": "React 18",
      "description": "A beautiful implementation using React",
      "url": "http://localhost:3001",
      "port": 3001,
      "status": "active",
      "author": "Your Name",
      "lastUpdated": "2025-12-08",
      "features": [
        "Design Tokens",
        "Component Library",
        "Responsive Design"
      ]
    }
  ]
}
```

### Step 5: Test and Share

```bash
# Install dependencies
cd ../../
npm install

# Start your prototype
npm run dev -w @supernova-test/my-framework-prototype

# View in gallery
npm run gallery
```

## 📸 Gallery

The gallery app (`apps/gallery/`) provides a central hub to:
- View all available prototypes
- Launch prototypes with one click
- See framework comparisons
- Share with stakeholders

Access it at: http://localhost:3000

## 🤝 Collaboration Tips

### For Contributors

1. **Keep design tokens in sync**: Run `npm run fetch-supernova` regularly
2. **Follow naming conventions**: Use `@supernova-test/[app-name]` for packages
3. **Update the gallery**: Add your prototype to `prototypes.json`
4. **Document your work**: Add a README to your prototype
5. **Share screenshots**: Add preview images to your prototype folder

### For Designers

1. **Update Supernova**: Make changes in Supernova design system
2. **Notify developers**: Let the team know when updates are ready
3. **Review prototypes**: Use the gallery to see implementations
4. **Provide feedback**: Check if implementations match designs

## 🛠️ Tech Stack

- **Monorepo**: npm workspaces
- **Design System**: Supernova
- **Frameworks**: Your choice! (Angular, React, Vue, Svelte, etc.)
- **Shared Utilities**: `@supernova-test/supernova-sdk`
- **Gallery**: Vanilla HTML/CSS/JS (framework-agnostic)

## 📚 Useful Resources

- [Supernova Documentation](https://learn.supernova.io/)
- [Supernova SDK](https://github.com/Supernova-Studio/sdk-typescript)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## 🐛 Troubleshooting

### "Missing environment variables" error

Make sure you've created `.env` in `packages/supernova-sdk/` with valid credentials.

### "Module not found" errors

Run `npm install` at the root level to install all workspace dependencies.

### Supernova fetch fails

- Check your API token is valid
- Verify workspace and design system IDs
- Ensure you have network access

### Prototype doesn't appear in gallery

- Check `apps/gallery/prototypes.json` has your prototype entry
- Ensure the URL and port are correct
- Verify your prototype is running

## 📝 License

[Your License Here]

## 👥 Contributors

- Design System Team
- [Add your name!]

---

**Ready to build?** Start by running `npm install` and `npm run fetch-supernova`! 🚀
