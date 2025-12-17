# Prototype Gallery System Proposal

## Overview

This document outlines a proposal for creating a **shared prototype gallery** that enables designers to easily create, share, and view prototypes—all hosted within a single GitHub repository and deployed via GitHub Pages.

---

## Problem Statement

Currently, designers create prototypes locally but lack:
- A **central place** to view all team prototypes
- An **easy way** to share prototypes with stakeholders (public links)
- A **simple process** for non-technical designers to contribute new prototypes
- **Protection** for core infrastructure files while allowing open contribution

---

## Goals

1. **Public Gallery** - A single URL where anyone can view all prototypes
2. **Easy Contribution** - Designers can add prototypes without deep Git knowledge
3. **Automatic Deployment** - New prototypes appear in the gallery automatically
4. **Safe Collaboration** - Core files protected, only prototype folders editable
5. **Single Repository** - Everything lives in one monorepo

---

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   /apps                                                          │
│   ├── /gallery          ← Landing page (auto-generated)          │
│   ├── /recurring        ← Prototype by Edwin                     │
│   ├── /tooltip          ← Prototype by Sarah                     │
│   ├── /data-table       ← Prototype by Mike                      │
│   └── /[new-prototype]  ← Anyone can add!                        │
│                                                                  │
│   /packages             ← Shared code (protected)                │
│   /scripts              ← Build scripts (protected)              │
│   /.github              ← Actions & templates (protected)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ GitHub Actions (on push)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                     Build Process                                │
├─────────────────────────────────────────────────────────────────┤
│  1. Scan /apps for all prototypes                                │
│  2. Read each prototype.json for metadata                        │
│  3. Build each Angular app to subfolder                          │
│  4. Generate gallery index page                                  │
│  5. Deploy everything to GitHub Pages                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               GitHub Pages (Public URL)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   https://org.github.io/prototypes/                              │
│   ├── index.html        ← Gallery homepage                       │
│   ├── /recurring/       ← Live prototype                         │
│   ├── /tooltip/         ← Live prototype                         │
│   └── /data-table/      ← Live prototype                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prototype Metadata

Each prototype folder includes a `prototype.json` file:

```json
{
  "name": "Recurring Task Picker",
  "description": "A date picker component with recurring task scheduling",
  "author": "Edwin Delgado",
  "created": "2025-01-15",
  "tags": ["date-picker", "forms", "scheduling"],
  "thumbnail": "thumbnail.png",
  "status": "in-progress"
}
```

This metadata is used to:
- Generate gallery cards automatically
- Enable search/filtering in the gallery
- Track ownership and status

---

## Designer Contribution Flow

We propose **two options** for how designers create new prototypes:

---

## Option 1: GitHub Issue Form + Automated PR

### How It Works

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: Designer fills out GitHub Issue form                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  📝 Request New Prototype                                │    │
│   ├─────────────────────────────────────────────────────────┤    │
│   │                                                          │    │
│   │  Prototype Name*:     [ my-tooltip-component ]           │    │
│   │                                                          │    │
│   │  Your Name*:          [ Sarah Chen           ]           │    │
│   │                                                          │    │
│   │  Description*:        [ A tooltip component  ]           │    │
│   │                       [ with animations...   ]           │    │
│   │                                                          │    │
│   │  Template:            (•) Basic                          │    │
│   │                       ( ) Form-heavy                     │    │
│   │                       ( ) Data visualization             │    │
│   │                                                          │    │
│   │  [ Submit new issue ]                                    │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: GitHub Action automatically triggers                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   • Parses issue form data                                        │
│   • Creates new branch: sarah/my-tooltip-component                │
│   • Copies template files to /apps/my-tooltip-component/          │
│   • Fills in prototype.json with provided metadata                │
│   • Creates Pull Request                                          │
│   • Comments on issue with next steps                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: Designer receives automated response                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   💬 GitHub Bot commented:                                        │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  ✅ Your prototype has been created!                     │    │
│   │                                                          │    │
│   │  📁 Branch: sarah/my-tooltip-component                   │    │
│   │  🔗 PR: #42                                              │    │
│   │                                                          │    │
│   │  Next steps:                                             │    │
│   │  1. Clone the repo (if you haven't)                      │    │
│   │  2. Run: git checkout sarah/my-tooltip-component         │    │
│   │  3. Open /apps/my-tooltip-component in Cursor            │    │
│   │  4. Run: npm run dev                                     │    │
│   │  5. When ready, push your changes                        │    │
│   │                                                          │    │
│   │  Or edit in browser:                                     │    │
│   │  [Open in github.dev] [Open in Codespaces]               │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Technical Requirements

| Component | Technology | Notes |
|-----------|------------|-------|
| Issue Form | `.github/ISSUE_TEMPLATE/new-prototype.yml` | Native GitHub feature |
| Automation | GitHub Actions | Triggers on issue creation |
| File Creation | GitHub API | Creates branch, files, PR |
| Notifications | Issue comments | Automated by Action |

### Pros & Cons

| Pros | Cons |
|------|------|
| ✅ No additional infrastructure | ⚠️ ~30 second delay for automation |
| ✅ Works with existing GitHub Enterprise | ⚠️ Form is separate from gallery |
| ✅ Full audit trail via issues | ⚠️ Requires issue → PR → merge flow |
| ✅ Zero hosting costs | |
| ✅ Easy to implement (~1 day) | |

---

## Option 2: Gallery UI with GitHub OAuth

### How It Works

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: Designer visits gallery and clicks "Create New"         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  🚀 Prototype Gallery                      [ + Create ] │    │
│   ├─────────────────────────────────────────────────────────┤    │
│   │                                                          │    │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │    │
│   │  │ 📅      │  │ 🔔      │  │ 📊      │  │ 🎨      │     │    │
│   │  │Recurring│  │ Toast   │  │ Table   │  │ Theme   │     │    │
│   │  │ Edwin   │  │ Sarah   │  │ Mike    │  │ Carlos  │     │    │
│   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: Modal opens with GitHub OAuth                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                                                          │    │
│   │         ┌─────────────────────────────────┐              │    │
│   │         │  Create New Prototype           │              │    │
│   │         ├─────────────────────────────────┤              │    │
│   │         │                                 │              │    │
│   │         │  [🔐 Sign in with GitHub]       │              │    │
│   │         │                                 │              │    │
│   │         │  ─────────────────────────────  │              │    │
│   │         │                                 │              │    │
│   │         │  Name:  [                  ]    │              │    │
│   │         │  Desc:  [                  ]    │              │    │
│   │         │                                 │              │    │
│   │         │  Template: [Basic ▼]            │              │    │
│   │         │                                 │              │    │
│   │         │  [Create Prototype]             │              │    │
│   │         │                                 │              │    │
│   │         └─────────────────────────────────┘              │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: Client-side JavaScript calls GitHub API                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Browser (JavaScript) ──────────────────► GitHub API             │
│                                                                   │
│   Actions performed:                                              │
│   1. Create branch from main                                      │
│   2. Create /apps/[name]/prototype.json                           │
│   3. Copy template files                                          │
│   4. Create Pull Request                                          │
│   5. Return PR URL                                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 4: Designer is redirected to edit                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │  ✅ Prototype Created!                                   │    │
│   │                                                          │    │
│   │  Your prototype "my-tooltip" is ready.                   │    │
│   │                                                          │    │
│   │  [Open in VS Code (browser)]  [Open in Codespaces]       │    │
│   │                                                          │    │
│   │  Or clone locally:                                       │    │
│   │  ┌────────────────────────────────────────────────┐      │    │
│   │  │ git fetch && git checkout sarah/my-tooltip     │      │    │
│   │  └────────────────────────────────────────────────┘      │    │
│   │                                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Technical Requirements

| Component | Technology | Notes |
|-----------|------------|-------|
| Gallery UI | HTML/CSS/JS (or React) | Static site on GitHub Pages |
| Authentication | GitHub OAuth App | Needs to be registered in GitHub Enterprise |
| API Calls | GitHub REST API | Client-side, uses OAuth token |
| Hosting | GitHub Pages | No additional infrastructure |

### GitHub OAuth App Setup

1. Go to GitHub Enterprise → Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - **Name:** Prototype Gallery
   - **Homepage URL:** `https://org.github.io/prototypes/`
   - **Callback URL:** `https://org.github.io/prototypes/callback`
3. Note the **Client ID** (Client Secret not needed for public clients)

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| Token exposure | Use OAuth PKCE flow (no secret needed) |
| Scope limitation | Request only `repo` scope |
| Token storage | Store in sessionStorage (not localStorage) |
| CORS | GitHub API supports CORS for OAuth apps |

### Pros & Cons

| Pros | Cons |
|------|------|
| ✅ Best user experience | ⚠️ Requires OAuth App setup |
| ✅ Integrated into gallery | ⚠️ More complex implementation (~3-5 days) |
| ✅ Instant feedback | ⚠️ Needs IT/security approval for OAuth |
| ✅ No context switching | |
| ✅ Still hosted on GitHub Pages | |

---

## File Protection Strategy

### CODEOWNERS File

```
# .github/CODEOWNERS

# Core infrastructure - requires maintainer approval
/packages/                    @design-system-team
/scripts/                     @design-system-team  
/.github/                     @design-system-team
/apps/gallery/                @design-system-team
*.sh                          @design-system-team
package.json                  @design-system-team
package-lock.json             @design-system-team

# Prototype folders - open to all (no rule = no required approval)
# /apps/[prototype-name]/     Anyone can modify
```

### Branch Protection Rules

| Setting | Value |
|---------|-------|
| Require PR for merge | ✅ Yes |
| Required approvals | 1 (for core files) / 0 (for prototypes only) |
| Require status checks | ✅ Build must pass |
| Allow force push | ❌ No |

### Automated PR Validation

GitHub Action checks each PR:

```yaml
- If PR only modifies /apps/[name]/ → Auto-approve eligible
- If PR modifies core files → Require maintainer review
- Comment on PR with validation results
```

---

## Gallery Features

### MVP (Phase 1)

- [ ] Grid of prototype cards with thumbnails
- [ ] Click to open live prototype
- [ ] Search by name
- [ ] Filter by author
- [ ] "Create New" button (links to Issue form or OAuth modal)

### Future Enhancements (Phase 2+)

- [ ] Live preview thumbnails (auto-generated screenshots)
- [ ] Tags and categories
- [ ] Favorites/bookmarks
- [ ] Version history
- [ ] Comments/feedback on prototypes
- [ ] Analytics (view counts)
- [ ] Figma link integration

---

## Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy Gallery

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout code
      - uses: actions/checkout@v4
      
      # 2. Setup Node
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      # 3. Install dependencies
      - run: npm ci
      
      # 4. Discover all prototypes
      - name: Generate prototype manifest
        run: node scripts/generate-manifest.js
      
      # 5. Build each prototype
      - name: Build all prototypes
        run: node scripts/build-all.js
      
      # 6. Generate gallery index
      - name: Generate gallery
        run: node scripts/generate-gallery.js
      
      # 7. Deploy to GitHub Pages
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Recommendation

### Start with Option 1 (Issue Form + Action)

**Why:**
1. Can be implemented in 1 day
2. No OAuth/security approval needed
3. Provides immediate value
4. Can always upgrade to Option 2 later

### Upgrade to Option 2 when:
- Designer adoption is high
- Team wants smoother UX
- OAuth App approval is obtained

---

## Timeline Estimate

| Phase | Tasks | Duration |
|-------|-------|----------|
| **Phase 1** | Issue form + Action automation | 1-2 days |
| **Phase 2** | Gallery UI (static, no auth) | 2-3 days |
| **Phase 3** | Auto-build pipeline | 1-2 days |
| **Phase 4** | OAuth integration (Option 2) | 3-5 days |

**Total MVP (Phases 1-3):** ~1 week
**Full Solution (all phases):** ~2 weeks

---

## Questions for Engineering Team

1. **OAuth App:** Can we register a GitHub OAuth App in our Enterprise instance?
2. **GitHub Pages:** Is GitHub Pages enabled for our organization? Any restrictions?
3. **Actions:** Are GitHub Actions enabled? Any minute limits?
4. **Permissions:** Can we configure CODEOWNERS and branch protection rules?
5. **Domain:** Do we want a custom domain (e.g., `prototypes.company.com`)?

---

## Next Steps

1. [ ] Review this proposal with engineering team
2. [ ] Get answers to questions above
3. [ ] Decide: Start with Option 1 or go straight to Option 2?
4. [ ] Set up repository structure
5. [ ] Implement chosen solution
6. [ ] Create designer documentation
7. [ ] Pilot with 2-3 designers
8. [ ] Roll out to full team

---

## Appendix: File Structure

```
/prototypes (repository root)
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   │   └── new-prototype.yml        # Issue form for Option 1
│   └── workflows/
│       ├── create-prototype.yml     # Auto-creates PR from issue
│       ├── deploy.yml               # Builds and deploys gallery
│       └── pr-validation.yml        # Validates PRs
│
├── apps/
│   ├── gallery/                     # Gallery landing page
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js                   # OAuth logic for Option 2
│   │
│   ├── prototype-template/          # Template for new prototypes
│   │   ├── prototype.json
│   │   ├── package.json
│   │   └── src/...
│   │
│   ├── recurring/                   # Example prototype
│   │   ├── prototype.json
│   │   └── ...
│   │
│   └── [other-prototypes]/
│
├── packages/
│   └── supernova-sdk/               # Shared design tokens
│
├── scripts/
│   ├── generate-manifest.js         # Discovers all prototypes
│   ├── build-all.js                 # Builds all prototypes
│   └── generate-gallery.js          # Creates gallery HTML
│
├── docs/
│   ├── CONTRIBUTING.md              # Guide for designers
│   └── PROTOTYPE_GALLERY_PROPOSAL.md  # This document
│
└── package.json                     # Monorepo config
```

---

*Document created: December 2024*
*Author: Edwin Delgado*
*Status: Proposal*
