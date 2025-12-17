# Setting Up Prototypes Monorepo on a New Machine

This guide covers common issues and solutions when installing this monorepo on a new computer.

## 🍎 macOS Setup

### Issue: "nice-darwin-arm64 can't be opened" or "move to trash" errors

**Symptoms:**
- After `npm install`, you see popup dialogs saying binaries can't be verified
- macOS asks to move files to trash
- Development servers fail to start with permission errors
- Errors mention: `nice-darwin-arm64`, `esbuild`, or other native binaries

**Cause:**
macOS Gatekeeper blocks unsigned native binaries that are installed via npm. Packages like `@angular/build`, `esbuild`, `@img/sharp-*`, and others include platform-specific native binaries that macOS flags as potentially unsafe.

**Solution 1: Automatic (Recommended)**
The monorepo includes a postinstall script that runs automatically:
```bash
npm install
# The fix-macos-permissions.sh script runs automatically after install
```

**Solution 2: Manual Fix**
If the automatic fix didn't work or you need to run it again:
```bash
./fix-macos-permissions.sh
```

**Solution 3: System Settings**
If you still see blocking dialogs:
1. Go to **System Settings → Privacy & Security → Security**
2. You'll see a message about the blocked app
3. Click **"Allow Anyway"** or **"Open Anyway"**
4. Try running your command again

**Technical Details:**
The fix removes quarantine extended attributes from node_modules:
```bash
# What the script does
xattr -cr node_modules
```

This tells macOS to trust these files without requiring individual approvals.

---

## 💻 Windows Setup

### Issue: Long Path Names

**Symptoms:**
- Installation fails with "path too long" errors
- Can't delete node_modules

**Solution:**
Enable long path support:
```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

Or use npm's legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

---

## 🐧 Linux Setup

### Issue: Permission errors with npm global packages

**Solution:**
Configure npm to use a directory in your home folder:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 🌐 All Platforms

### Issue: Node version mismatch

**Symptoms:**
- Errors about Node.js version during install
- TypeScript compilation errors
- Module resolution failures

**Solution:**
Check required versions in `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=10.0.0"
  }
}
```

Use nvm (Node Version Manager) to install the correct version:
```bash
# macOS/Linux
nvm install 18
nvm use 18

# Windows (nvm-windows)
nvm install 18
nvm use 18
```

### Issue: npm install fails with network errors

**Solution 1: Clear npm cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Use different registry**
```bash
npm config set registry https://registry.npmjs.org/
```

**Solution 3: Increase timeout**
```bash
npm config set fetch-timeout 60000
npm install
```

### Issue: Workspace linking problems

**Symptoms:**
- Can't import from `@prototypes/supernova-sdk`
- Module not found errors for workspace packages

**Solution:**
Reinstall from root:
```bash
# From root directory
npm install
npm run build  # Build all packages first
```

---

## ✅ Post-Installation Checklist

After installing on a new machine, run through these checks:

1. **Prerequisites**
   ```bash
   ./check-prerequisites.sh
   ```

2. **Fix macOS permissions** (macOS only)
   ```bash
   ./fix-macos-permissions.sh
   ```

3. **Verify Supernova credentials**
   ```bash
   cd packages/supernova-sdk
   cat .env  # Should have your API tokens
   ```

4. **Test gallery**
   ```bash
   ./start-gallery.sh
   open http://localhost:3000
   ```

5. **Test a prototype**
   ```bash
   ./start-prototype.sh calendar
   open http://localhost:4200
   ```

6. **Update gallery path** (first time only)
   ```bash
   ./update-gallery-path.sh
   ```

---

## 🔐 Environment Setup

### First Time Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Prototypes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supernova**
   ```bash
   cd packages/supernova-sdk
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Fetch design system data**
   ```bash
   npm run fetch-supernova
   ```

5. **Start developing**
   ```bash
   ./start-all.sh
   ```

---

## 🆘 Still Having Issues?

### Get detailed logs
```bash
npm install --verbose
npm run dev -w @prototypes/calendar -- --verbose
```

### Check for port conflicts
```bash
# macOS/Linux
lsof -i :3000
lsof -i :4200

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4200
```

### Reset everything
```bash
# Nuclear option - clean slate
./stop-all.sh
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f package-lock.json apps/*/package-lock.json packages/*/package-lock.json
npm install
./fix-macos-permissions.sh  # macOS only
```

---

## 📚 Additional Resources

- [SCRIPTS.md](./SCRIPTS.md) - All available scripts
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Command cheatsheet
- [README.md](../README.md) - Project overview

