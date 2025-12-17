# 🚀 Quick Reference Card

Print this or keep it handy!

---

## Essential Commands

```bash
# First Time Setup
npm install
./check-prerequisites.sh

# Start Working
./start-all.sh              # Gallery + All prototypes
./start-gallery.sh          # Gallery only
./start-prototype.sh name   # One prototype

# Stop Working
./stop-all.sh

# Create New
./create-prototype.sh

# Troubleshoot
./sync-gallery.sh          # Sync gallery
./check-prerequisites.sh   # Check setup
```

---

## Ports

- **Gallery:** http://localhost:3000
- **New prototypes:** 4201, 4202, etc.

---

## File Structure

```
apps/
├── your-prototype/
│   └── src/
│       └── app/
│           ├── app.ts        # Logic
│           ├── app.html      # Template
│           ├── app.scss      # Styles
│           └── app.config.ts # Config
```

---

## Import Design Tokens

**TypeScript:**
```typescript
import { DesignTokens } from '@prototypes/supernova-sdk/output/tokens/tokens';
```

**SCSS:**
```scss
@import '@prototypes/supernova-sdk/output/tokens/tokens';
```

---

## Animations

```typescript
import { trigger, transition, style, animate } from '@angular/animations';

animations: [
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-out', style({ opacity: 1 }))
    ])
  ])
]
```

## Component Template

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent {
  // Your code here
}
```

---

## NPM Commands

```bash
npm run dev -w @prototypes/name   # Start one
npm run build                     # Build all
npm run test                      # Test all
npm run gallery                   # Gallery only
npm run fetch-supernova           # Update tokens
```

---

## Cursor AI Prompts

- "Start the gallery"
- "Create a new prototype"
- "Help me add animations to this component"
- "Show me how to use design tokens"
- "Check if my setup is correct"

---

## Documentation

- **README.md** - Full documentation
- **START_HERE.md** - Quick start guide
- **SCRIPTS.md** - All scripts explained

---

## Common Issues

**Port in use?**
```bash
./stop-all.sh
./start-all.sh
```

**Gallery out of sync?**
```bash
./sync-gallery.sh
```

**Missing dependencies?**
```bash
npm install
```

**Scripts not working?**
```bash
chmod +x *.sh
```

---

## Need Help?

1. Check documentation files above
2. Run `./check-prerequisites.sh`
3. Ask Cursor AI
4. Check terminal for error messages

---

**Happy Prototyping!** 🎨
