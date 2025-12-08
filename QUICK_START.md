# 🚀 Quick Start Guide

Get up and running with the Supernova monorepo in 5 minutes!

## ⚡ Super Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure Supernova (one-time setup)
cd packages/supernova-sdk
cp .env.example .env
# Edit .env with your Supernova credentials

# 3. Fetch design system data
npm run fetch-all

# 4. Go back to root
cd ../..

# 5. Start the gallery
npm run gallery
```

Visit http://localhost:3000 to see all prototypes! 🎉

## 🎯 Common Tasks

### View All Prototypes
```bash
npm run gallery
```
Opens the gallery at http://localhost:3000

### Run the Angular Prototype
```bash
npm run dev -w @supernova-test/angular-prototype
```
Opens at http://localhost:4200

### Update Design Tokens
```bash
npm run fetch-supernova
```
Syncs tokens, components, and assets from Supernova

### Add a New Prototype
```bash
# 1. Copy the template
cp -r apps/.template apps/my-new-prototype

# 2. Initialize your framework
cd apps/my-new-prototype
# ... set up your framework

# 3. Add to gallery
# Edit apps/gallery/prototypes.json

# 4. Install and run
cd ../..
npm install
npm run dev -w @supernova-test/my-new-prototype
```

## 📁 Project Structure

```
Supernova test/
├── apps/
│   ├── angular-prototype/    ← Angular implementation
│   ├── gallery/              ← Prototype gallery (start here!)
│   └── .template/            ← Copy this for new prototypes
│
├── packages/
│   └── supernova-sdk/        ← Shared design system utilities
│       ├── output/           ← Generated tokens & assets
│       └── .env              ← Your Supernova credentials
│
└── package.json              ← Root workspace config
```

## 🔑 Getting Supernova Credentials

1. Log in to [Supernova](https://supernova.io)
2. Go to **Settings** → **API Tokens**
3. Create a new token
4. Find your Workspace ID and Design System ID in the URLs
5. Add them to `packages/supernova-sdk/.env`

## 💡 Pro Tips

- **Gallery first**: Always start by checking the gallery at http://localhost:3000
- **Sync regularly**: Run `npm run fetch-supernova` when design updates happen
- **Use workspaces**: Run commands on specific apps with `-w` flag
- **Check the template**: Use `apps/.template` as a starting point
- **Read CONTRIBUTING.md**: Full guide for adding prototypes

## 🆘 Help!

### Nothing works after cloning

```bash
npm install  # Installs ALL dependencies for the monorepo
```

### Can't connect to Supernova

Check your `.env` file in `packages/supernova-sdk/`:
- Is the API token valid?
- Are the IDs correct?
- Do you have network access?

### Prototype doesn't show in gallery

1. Make sure it's added to `apps/gallery/prototypes.json`
2. Check the URL and port are correct
3. Verify the prototype is actually running

### Import errors for @supernova-test packages

```bash
# From root directory
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. ✅ **Explore**: Check out the gallery and existing prototypes
2. 📖 **Read**: Review [README.md](./README.md) for full documentation
3. 🎨 **Design**: Fetch your design tokens with `npm run fetch-supernova`
4. 🚀 **Build**: Create your first prototype using the template
5. 🤝 **Share**: Add it to the gallery and share with the team!

---

**Need more help?** Check [README.md](./README.md) or [CONTRIBUTING.md](./CONTRIBUTING.md)
