# lenix

The Monorepo for the software engineering community

![](https://img.shields.io/npm/d18m/lenix)
![](https://img.shields.io/npm/v/lenix)

## 🔗 Depend
```json
"lenix": "latest",
```

## 📥 Install
### NPM
```bash
npm i lenix
```
### PNPM
```bash
pnpm i lenix
```
### BUN
```bash
bun i lenix
```
### YARN
```bash
yarn add lenix
```

## GitHub
[![](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lenixdev/lenix)

## 🗺️ Roadmap
- [ ] fix the lint tsconfig.json file creation when no file is found
- [-] trim the diff's unusefull text
- [ ] use walkthrough instead of custom page
- [ ] use webview to add quick settings
- [ ] use modal dialog to confirm the walkthrough
- [x] use progressive notify
- [ ] use add commit reminder
- [ ] add a revert last commit button

## 🧾License
![](https://img.shields.io/npm/l/lenix)

## 📞 Support
[![](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/users/886958797631926373)

## 💻 Build with
![](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/node.js-%23007ACC.svg?style=for-the-badge&logo=node.js&logoColor=white)

# Lua Object Oriented Programming Class Module

Lua object oriented programming class module allow you to use oop similar to the TypeScript/JavaScript/Java/C++ Classes

## 🗺️ Roadmap
- [ ] Implement the complete annotation
- [ ] Provide Documentation
- [ ] Clearify the installation steps

## Lua Modules Setup

Auto-configure Lua to use `./lua_modules` (like `node_modules`) instead of unorganized directories.

### Install
- MAC
```bash
npx mac-lua-modules
```

### Usage
```bash
# Install Lua packages
luarocks install --tree ./lua_modules inspect

# Use in code (no setup needed)
local inspect = require('inspect')
print(inspect({name = "Lenix"}))
```

### What it does

Adds environment variables to your shell config (for mac users: `~/.zshrc` or `~/.bashrc`) to automatically change your Lua modules configurations to `./lua_modules` instead of hidden nested directories.


## ESLINT Usage
### Build your own linter
```zsh
npx lenix --lint
```
### Clone a preset lint
```zsh
npx lenix --lint --preset
```