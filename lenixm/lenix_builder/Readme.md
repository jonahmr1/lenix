# FiveM JavaScript Files Obfuscator

## Setup (One Time)

```bash
npm i
```

## Build

```bash
npm run build
```

## What It Does

- Automatically finds all `.js` files and creates minified + obfuscated versions in `build/` folders next to each file.
- Automatically replace the old fxmanifest js files target to the new build files :)

**Example:**
```
main.js → build/main.js
web/script.js → build/web/script.js
```

```lua
server_scripts {
  'main.js' → 'build/main.js',
  'web/script.js' → 'build/web/script.js'
}
```

That's it!