## Lua Modules Setup

Auto-configure Lua to use `./lua_modules` (like `node_modules`).

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
```