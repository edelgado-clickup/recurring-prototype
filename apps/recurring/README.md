# Recurring Task Prototype

An Angular prototype demonstrating recurring task functionality with an interactive date picker and recurring configuration.

## Live Demo

🚀 **[View Live Demo](https://edelgado-clickup.github.io/recurring-prototype/)**

## Features

- **Interactive Date Picker**: Calendar view with preset options
- **Recurring Task Setup**: Configure complex recurring schedules
  - Multiple frequency options (Days, Weeks, Months, Quarters, Years)
  - Day selection for weekly recurrence
  - Custom triggers and actions
  - Visual calendar highlighting for recurring dates
- **Smart Date Display**: Shows day names for nearby dates, d/m/y for distant dates
- **Recurring Tooltip**: Hover over due dates to see the full recurring sentence
- **Task Screen**: Clean task detail view with date management

## Development

### Prerequisites
- Node.js 18+ 
- npm 10+

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:4555/`

### Build for Production
```bash
npm run build
```

## Deployment

This prototype is automatically deployed to GitHub Pages.

### Deploy to GitHub Pages
```bash
npm run deploy
```

This will:
1. Build the production version with the correct base href
2. Deploy to the `gh-pages` branch
3. Make it available at https://edelgado-clickup.github.io/recurring-prototype/

### Manual Deployment
```bash
# Build with base href
npm run build -- --base-href=/recurring-prototype/

# Deploy to gh-pages
npx gh-pages -d dist/recurring/browser
```

## Tech Stack

- **Angular 21** with standalone components
- **TypeScript 5.9**
- **SCSS** for styling
- **Supernova Design System** tokens
- **Angular Animations** for smooth transitions

## Project Structure

```
apps/recurring/
├── src/
│   ├── app/
│   │   ├── app.ts              # Root component
│   │   ├── date-picker/        # Date picker component
│   │   └── task-screen/        # Task screen component
│   ├── assets/                 # Static assets
│   └── styles.scss             # Global styles
├── angular.json                # Angular configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Design System

This prototype uses the Supernova design system for consistent styling:
- Design tokens from `@prototypes/supernova-sdk`
- SF Pro font family
- Consistent spacing, colors, and typography

## License

Private prototype for internal use.
