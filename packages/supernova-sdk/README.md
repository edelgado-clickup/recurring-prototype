# @supernova-test/supernova-sdk

Shared Supernova SDK utilities for fetching design tokens, components, and assets across all prototype apps.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supernova credentials in `.env`:
   - `SUPERNOVA_API_TOKEN`: Your Supernova API token
   - `SUPERNOVA_WORKSPACE_ID`: Your workspace ID
   - `SUPERNOVA_DESIGN_SYSTEM_ID`: Your design system ID

## Usage

### Fetch Design Tokens

```bash
npm run fetch-tokens
```

Generates:
- `output/tokens/_tokens.scss` - SCSS variables
- `output/tokens/tokens.css` - CSS custom properties
- `output/tokens/tokens.ts` - TypeScript constants

### Fetch Components

```bash
npm run fetch-components
```

Generates:
- `output/components/components.json` - Component specifications
- `output/components/component-specs.ts` - TypeScript interfaces
- `output/components/COMPONENTS.md` - Documentation

### Fetch Assets

```bash
npm run fetch-assets
```

Downloads SVG assets and generates:
- `output/assets/*.svg` - Downloaded assets
- `output/assets/assets-manifest.json` - Asset manifest
- `output/assets/assets.ts` - TypeScript helper

### Fetch All

```bash
npm run fetch-all
```

Runs all three fetch commands.

## Integration

Apps in the monorepo can reference the generated files from this package:

```typescript
// In your app
import { DesignTokens } from '@supernova-test/supernova-sdk/output/tokens/tokens';
import { SupernovaAssets } from '@supernova-test/supernova-sdk/output/assets/assets';
```

Or copy the files to your app's source directory during build.
