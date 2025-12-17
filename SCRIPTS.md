# 📜 Scripts Reference Guide

Quick reference for all available scripts in the Prototypes monorepo.

---

## 🚀 Quick Start Commands

### Start Everything
```bash
./start-all.sh
```
**What it does:**
- Starts the Gallery on port 3000
- Starts ALL prototypes on their configured ports
- Automatically syncs the gallery with the filesystem
- Kills any existing processes on those ports first

**When to use:** When you want to see all prototypes running at once

---

### Start Gallery Only
```bash
./start-gallery.sh
```
**What it does:**
- Starts ONLY the gallery on port 3000
- Updates the gallery path automatically
- Does NOT start any prototypes

**When to use:** 
- When you just want to browse prototypes
- When you want to manually start individual prototypes later
- For demonstrations or reviews

**View at:** http://localhost:3000

---

### Start Individual Prototype
```bash
./start-prototype.sh prototype-name
```
**What it does:**
- Starts a single prototype on its configured port
- Kills any existing process on that port first

**When to use:** When you're working on one specific prototype

**Example:**
```bash
./start-prototype.sh calendar
```

---

### Stop Everything
```bash
./stop-all.sh
```
**What it does:**
- Kills all processes on ports 3000-9999
- Cleans up all running dev servers

**When to use:** 
- When you're done working
- Before starting fresh
- If something is stuck

---

## 🎨 Create & Manage Prototypes

### Create New Prototype
```bash
./create-prototype.sh
```
**What it does:**
- Interactive wizard to create a new prototype
- Copies the template folder
- Configures all files (package.json, angular.json, etc.)
- Adds prototype to the gallery automatically
- Installs dependencies

**Prompts you for:**
- Prototype name
- Description
- Port number (suggests next available)
- Author name

---

### Edit Prototype Details
```bash
./edit-prototype.sh prototype-name [options]
```
**What it does:**
- Updates prototype metadata in gallery
- Options: `--description`, `--author`, `--icon`, `--framework`

**Examples:**
```bash
# Update description
./edit-prototype.sh calendar --description "Calendar picker playground"

# Update author
./edit-prototype.sh calendar --author "Design Team"

# Update multiple fields
./edit-prototype.sh calendar --description "New desc" --icon "📅"
```

---

### Sync Gallery
```bash
./sync-gallery.sh
```
**What it does:**
- Scans the `apps/` folder
- Removes deleted prototypes from gallery
- Updates prototype count
- Keeps gallery in sync with filesystem

**When to use:**
- After manually deleting a prototype
- If gallery shows prototypes that don't exist
- After moving or renaming folders

---

## 🔧 Utility Scripts

### Check Prerequisites
```bash
./check-prerequisites.sh
```
**What it does:**
- Checks if Node.js 18+ is installed
- Checks if npm 10+ is installed
- Checks if Python3 is available (for gallery server)
- Verifies dependencies are installed

**When to use:**
- First time setup
- Troubleshooting installation issues
- Before sharing with a new user

---

### Update Gallery Path
```bash
./update-gallery-path.sh
```
**What it does:**
- Updates `prototypes.json` with YOUR workspace path
- Replaces previous owner's path with yours

**When to use:**
- First time setup (runs automatically with `start-all.sh`)
- If gallery shows wrong file paths
- After moving the project folder

---

## 📦 NPM Scripts

These run from the project root:

### Install All Dependencies
```bash
npm install
```
**When to use:**
- First time setup
- After adding a new prototype
- After pulling updates from Git

---

### Start All Prototypes (Alternative)
```bash
npm run dev
```
**What it does:**
- Runs `npm run dev` in ALL workspaces
- Similar to `start-all.sh` but without gallery

---

### Start Gallery (Alternative)
```bash
npm run gallery
```
**What it does:**
- Starts gallery server on port 3000
- Same as `./start-gallery.sh`

---

### Start Specific Prototype
```bash
npm run dev -w @prototypes/prototype-name
```
**Example:**
```bash
npm run dev -w @prototypes/calendar
npm run dev -w @prototypes/toast
```

---

### Build All Prototypes
```bash
npm run build
```
**What it does:**
- Creates production builds for all prototypes
- Output goes to each prototype's `dist/` folder

---

### Run All Tests
```bash
npm run test
```
**What it does:**
- Runs unit tests across all prototypes

---

### Fetch Supernova Data
```bash
npm run fetch-supernova
```
**What it does:**
- Fetches design tokens, components, and assets from Supernova
- Updates `packages/supernova-sdk/output/`

**When to use:**
- After design system changes in Supernova
- To get latest tokens and assets

---

## 🤖 Cursor AI Commands

When using Cursor AI, you can say:

### "Start the gallery"
**AI will run:** `./start-gallery.sh`

### "Start all prototypes"
**AI will run:** `./start-all.sh`

### "Create a new prototype"
**AI will run:** `./create-prototype.sh` and help you answer the questions

### "Stop everything"
**AI will run:** `./stop-all.sh`

### "Check if my setup is correct"
**AI will run:** `./check-prerequisites.sh` and explain results

---

## 📁 Script Locations

All scripts are in the project root:
```
Prototypes/
├── check-prerequisites.sh
├── create-prototype.sh
├── edit-prototype.sh
├── start-all.sh
├── start-gallery.sh
├── start-prototype.sh
├── stop-all.sh
├── sync-gallery.sh
└── update-gallery-path.sh
```

---

## 💡 Common Workflows

### Starting Your Day
```bash
# Option 1: Start everything
./start-all.sh

# Option 2: Start gallery + specific prototype
./start-gallery.sh
./start-prototype.sh calendar
```

### Creating New Prototype
```bash
./create-prototype.sh
# Follow prompts
# Prototype auto-appears in gallery
```

### Ending Your Day
```bash
./stop-all.sh
```

### Troubleshooting
```bash
# Check if everything is set up
./check-prerequisites.sh

# Stop and restart
./stop-all.sh
./start-all.sh

# Sync gallery if something looks wrong
./sync-gallery.sh
```

---

## 🆘 Help

- **Script not working?** Make sure it's executable: `chmod +x *.sh`
- **Port conflicts?** Run `./stop-all.sh` first
- **Gallery out of sync?** Run `./sync-gallery.sh`
- **Missing dependencies?** Run `npm install`

---

**Questions?** Check [README.md](./README.md) or [START_HERE.md](./START_HERE.md)
