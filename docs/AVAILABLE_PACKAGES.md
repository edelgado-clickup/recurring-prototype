# Available Packages for Prototypes

This monorepo includes common packages that are available to all prototypes. These packages are installed at the root level and inherited by all workspace apps.

## Angular Core Packages

All prototypes have access to the following Angular packages (v21.0.0):

### Runtime Dependencies

- **`@angular/animations`** - Angular's animation system for smooth transitions and effects
  - Use with `provideAnimations()` in your `app.config.ts`
  - Perfect for: toasts, modals, transitions, state changes
  
- **`@angular/common`** - Common Angular directives and pipes
  - Includes: `NgIf`, `NgFor`, `NgClass`, `AsyncPipe`, date pipes, etc.
  
- **`@angular/compiler`** - Angular template compiler
  
- **`@angular/core`** - Core Angular framework
  
- **`@angular/forms`** - Form handling and validation
  - Includes: `FormsModule`, `ReactiveFormsModule`
  - Perfect for: input validation, form state management
  
- **`@angular/platform-browser`** - Browser platform APIs
  
- **`@angular/router`** - Angular routing system
  - Perfect for: multi-page prototypes, navigation

- **`rxjs`** (v7.8.0) - Reactive programming library
  - Perfect for: async operations, event handling, state management

- **`tslib`** (v2.3.0) - TypeScript helper library

### Development Dependencies

- **`@angular/build`** - Angular build system
- **`@angular/cli`** - Angular CLI tools
- **`@angular/compiler-cli`** - Angular AOT compiler
- **`typescript`** (v5.9.2) - TypeScript language
- **`vitest`** (v4.0.8) - Fast unit testing framework
- **`jsdom`** (v27.1.0) - DOM implementation for testing

## Design System

- **`@prototypes/supernova-sdk`** - Your Supernova design system integration
  - Design tokens (colors, spacing, typography)
  - Component specifications
  - SVG icons and assets

## Usage Examples

### Using Animations

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
  ]
};
```

```typescript
// app.ts
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class App {}
```

### Using Reactive Forms

```typescript
// app.ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
})
export class App {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder) {}
}
```

### Using Router

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ]
};
```

## Adding More Packages

If you need additional packages for all prototypes:

1. Add them to the root `package.json`
2. Run `npm install` from the project root
3. Update this documentation

If you only need a package for one specific prototype, add it to that prototype's `package.json` instead.

## Template Updates

The `apps/prototype-template` directory includes all these packages by default. When creating new prototypes using the `create-prototype.sh` script, they will automatically have access to these packages.


