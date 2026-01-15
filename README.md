# 🌟 Prototypes - Design System Monorepo

A monorepo for creating and sharing design system prototypes across multiple frameworks, powered by [Supernova](https://www.supernova.io/).


## 📖 Documentation Guide

All documentation is in the **[`docs/`](docs/)** folder:

- **📜 [SCRIPTS.md](docs/SCRIPTS.md)** - Complete scripts reference
- **📦 [AVAILABLE_PACKAGES.md](docs/AVAILABLE_PACKAGES.md)** - What's pre-installed


## 📋 Overview

This monorepo enables teams to:
- 🎨 Share design tokens, components, and assets from Supernova
- 🚀 Create prototypes in any framework (Angular, React, Vue, Svelte, etc.)
- 📦 Maintain consistency across all implementations
- 🎯 Collaborate and showcase different approaches
- 📖 Browse all prototypes in a unified gallery

## 🏗️ Project Structure

```
Prototypes/
├── apps/                           # Application prototypes
│   ├── calendar/                   # Calendar - Angular implementation
│   ├── gallery/                    # Gallery website
│   └── [your-framework-prototype]/ # Add more here!
│
├── packages/                       # Shared packages
│   ├── supernova-sdk/              # Supernova integration utilities
│   │   ├── scripts/                # Fetch scripts
│   │   ├── output/                 # Generated tokens, components, assets
│   │   └── .env                    # Supernova credentials
│   └── theme-toggle/               # Reusable light/dark mode toggle component
│
├── package.json                    # Root workspace configuration
└── README.md                       # This file
```

## ⚡ Quick Start

```bash
# Check if you have Node.js and npm
./check-prerequisites.sh

# Install dependencies (first time only)
npm install

# Update gallery with your path
./update-gallery-path.sh

# Create a new prototype
./create-prototype.sh

# Start everything
./start-all.sh

# Open gallery
open http://localhost:3000
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

5. **Start all servers**
   
   **Option A: Using the startup script (Recommended)**
   ```bash
   ./start-all.sh
   ```
   This starts both the gallery (port 3000) and Angular prototype (port 4200)
   
   **Option B: Start individually**
   ```bash
   # Gallery only
   npm run gallery
   
   # Recurring Task only (in another terminal)
   npm run dev -w @prototypes/calendar
   ```
   
6. **Visit the apps**
   - Gallery: http://localhost:3000
   - Recurring Task: http://localhost:4200

## 📦 Available Scripts

> **📜 Full documentation:** See [SCRIPTS.md](./SCRIPTS.md) for detailed info on all scripts

### Quick Start Scripts

```bash
# Start the gallery AND all prototypes
./start-all.sh

# Start ONLY the gallery (no prototypes)
./start-gallery.sh

# Start a specific prototype
./start-prototype.sh prototype-name

# Stop all development servers
./stop-all.sh

# Create a new prototype (interactive)
./create-prototype.sh

# Edit prototype details
./edit-prototype.sh prototype-name --description "New description" --author "Author Name"

# Sync gallery (removes deleted prototypes)
./sync-gallery.sh

# Update gallery with correct workspace path
./update-gallery-path.sh
```

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
npm run dev -w @prototypes/calendar

# Build a specific app
npm run build -w @prototypes/calendar

# Run tests for a specific app
npm run test -w @prototypes/calendar
```

## 📚 Shared Packages

### Theme Toggle Component

A reusable Angular component for light/dark mode switching across all prototypes.

**Quick Setup:**

1. Add to `tsconfig.json`:
   ```json
   "paths": {
     "@prototypes/theme-toggle": ["../../packages/theme-toggle/index.ts"]
   }
   ```

2. Import in your component:
   ```typescript
   import { ThemeToggleComponent } from '@prototypes/theme-toggle';
   
   @Component({
     imports: [ThemeToggleComponent]
   })
   ```

3. Add to template:
   ```html
   <theme-toggle></theme-toggle>
   ```

4. Style for dark mode in your SCSS:
   ```scss
   :host-context(.dark-theme) {
     .my-component {
       background: #1a1a1a;
       color: #ffffff;
     }
   }
   ```

📖 **Full documentation:** [packages/theme-toggle/USAGE.md](packages/theme-toggle/USAGE.md)

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
import { DesignTokens } from '@prototypes/supernova-sdk/output/tokens/tokens';
import { SupernovaAssets } from '@prototypes/supernova-sdk/output/assets/assets';

// Use tokens
const primaryColor = DesignTokens.color_primary;

// Use assets
const iconPath = SupernovaAssets['icon-name'];
```

```scss
// In your app's SCSS
@import '@prototypes/supernova-sdk/output/tokens/tokens';

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
  "name": "@prototypes/my-framework-prototype",
  "version": "1.0.0",
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "test": "your-test-command"
  },
  "dependencies": {
    "@prototypes/supernova-sdk": "*",
    // ... your framework dependencies
  }
}
```

### Step 3: Use Shared Supernova Data

Reference the shared design tokens, components, and assets:

```typescript
// Import tokens
import { DesignTokens } from '@prototypes/supernova-sdk/output/tokens/tokens';

// Import assets
import { SupernovaAssets } from '@prototypes/supernova-sdk/output/assets/assets';

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
npm run dev -w @prototypes/my-framework-prototype

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

### Prototype doesn't appear in gallery

- Check `apps/gallery/prototypes.json` has your prototype entry
- Ensure the URL and port are correct
- Verify your prototype is running
- Run `./sync-gallery.sh` to refresh

## 🔧 Troubleshooting

### macOS "can't be opened" or "move to trash" errors

When installing on a new Mac, you may see errors about binaries like `nice-darwin-arm64` or similar native packages being blocked by macOS Gatekeeper.

**Quick Fix:**
```bash
# Run this after npm install
./fix-macos-permissions.sh
```

This removes quarantine flags from native binaries in node_modules. The script runs automatically on `npm install`, but if you still see issues:

1. Run the script manually: `./fix-macos-permissions.sh`
2. If still blocked, go to **System Settings → Privacy & Security → Security** and click "Allow Anyway"
3. Try running your script again

**Why this happens:** macOS Gatekeeper flags unsigned native binaries (from packages like `esbuild`, `@angular/build`, etc.) as potentially unsafe when installed via npm.
