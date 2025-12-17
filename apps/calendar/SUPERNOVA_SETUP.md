# Supernova Design Tokens Integration

This Angular application is set up to use design tokens from Supernova, making it easy to maintain consistent styling across your application.

## 🚀 Quick Start

### 1. Configure Supernova Credentials

Create a `.env` file in the project root (copy from `.env.example`):

```bash
SUPERNOVA_API_TOKEN=your_api_token_here
SUPERNOVA_WORKSPACE_ID=your_workspace_id_here
SUPERNOVA_DESIGN_SYSTEM_ID=your_design_system_id_here
```

**Where to find these values:**

- **API Token**: Go to [Supernova Settings → API Tokens](https://cloud.supernova.io/settings/tokens)
- **Workspace ID**: Found in your Supernova workspace URL: `https://cloud.supernova.io/workspace/{workspace_id}`
- **Design System ID**: Found in your design system URL: `https://cloud.supernova.io/workspace/{workspace_id}/design-system/{design_system_id}`

### 2. Fetch Design Tokens

Run the token fetcher script:

```bash
npm run fetch-tokens
```

This will:
- Connect to your Supernova workspace
- Fetch all design tokens
- Generate three token files:
  - `src/styles/tokens/_tokens.scss` - SCSS variables
  - `src/styles/tokens/tokens.css` - CSS custom properties
  - `src/styles/tokens/tokens.ts` - TypeScript constants

### 3. Use Tokens in Your Components

The tokens are already integrated into the application! Example tokens are provided as a starting point.

## 📦 Available Token Files

### SCSS Variables (`_tokens.scss`)

Use in SCSS files:

```scss
@import 'styles/tokens/tokens';

.my-component {
  color: $color-primary;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  font-size: $font-size-md;
}
```

### CSS Custom Properties (`tokens.css`)

Use in component styles or directly in HTML:

```css
.my-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

### TypeScript Constants (`tokens.ts`)

Use in TypeScript/JavaScript:

```typescript
import { DesignTokens } from './styles/tokens/tokens';

const buttonStyle = {
  backgroundColor: DesignTokens.color_primary,
  padding: DesignTokens.spacing_md,
};
```

## 🎨 Token Categories

The generated tokens typically include:

- **Colors**: Primary, secondary, text, background colors
- **Spacing**: Margin, padding, gap values
- **Typography**: Font families, sizes, weights, line heights
- **Borders**: Border widths, radii, colors
- **Shadows**: Box shadow values
- **Transitions**: Animation durations and easing
- **Form Fields**: Input heights, padding, focus states
- **Buttons**: Button dimensions, padding, states

## 🔄 Updating Tokens

Whenever your design tokens change in Supernova:

```bash
npm run fetch-tokens
```

The token files will be regenerated with the latest values. Your components using these tokens will automatically reflect the updates.

## 📁 Project Structure

```
angular-prototype/
├── scripts/
│   └── fetch-tokens.js       # Token fetcher script
├── src/
│   ├── styles/
│   │   └── tokens/
│   │       ├── _tokens.scss  # SCSS variables (auto-generated)
│   │       ├── tokens.css    # CSS custom properties (auto-generated)
│   │       └── tokens.ts     # TypeScript constants (auto-generated)
│   ├── styles.scss           # Global styles (imports tokens)
│   └── app/
│       ├── form-section/
│       │   └── form-section.scss  # Uses design tokens
│       └── header/
│           └── header.scss    # Uses design tokens
├── .env                       # Supernova credentials (not in git)
└── .env.example              # Example credentials file
```

## 🎯 Current Token Usage

The application currently uses tokens in:

1. **Global Styles** (`styles.scss`)
   - Typography (font family, sizes, weights)
   - Colors (text, background)
   - Base layout

2. **Form Components** (`form-section.scss`)
   - Input field styling (borders, padding, focus states)
   - Button styling
   - Spacing and layout
   - Typography

3. **Header** (`header.scss`)
   - Colors and backgrounds
   - Spacing and padding
   - Typography
   - Shadows

## 🔧 Customization

### Modifying the Token Export

Edit `scripts/fetch-tokens.js` to customize:

- Token naming conventions
- Output formats
- Token grouping
- Additional token types

### Adding More Token Files

You can export tokens in additional formats by extending the script:

- JSON for configuration files
- JavaScript modules for dynamic imports
- Theme files for different color schemes

## 📚 Best Practices

1. **Always use tokens** instead of hard-coded values for:
   - Colors
   - Spacing
   - Typography
   - Borders and shadows

2. **Update regularly**: Run `npm run fetch-tokens` after design changes

3. **Version control**: Commit generated token files to track design changes

4. **Type safety**: Use TypeScript tokens for programmatic styling

5. **Documentation**: Comment custom token usage for team clarity

## 🐛 Troubleshooting

### "Missing required environment variables"

Ensure your `.env` file has all three required values:
- `SUPERNOVA_API_TOKEN`
- `SUPERNOVA_WORKSPACE_ID`
- `SUPERNOVA_DESIGN_SYSTEM_ID`

### "No tokens found in the design system"

- Verify your design system ID is correct
- Check that your design system has published tokens
- Ensure your API token has read permissions

### SCSS Import Errors

Make sure you're using the correct import path:
```scss
@import 'styles/tokens/tokens';  // From src/ directory
@import '../../styles/tokens/tokens';  // From component directory
```

## 🔗 Resources

- [Supernova Documentation](https://learn.supernova.io)
- [Supernova SDK](https://www.npmjs.com/package/@supernovaio/supernova-sdk)
- [Design Tokens Specification](https://designtokens.org)

## 🎉 Next Steps

1. Configure your Supernova credentials in `.env`
2. Run `npm run fetch-tokens` to get your actual design tokens
3. Review the generated token files
4. Start building components using the design tokens
5. Maintain design consistency across your application!

