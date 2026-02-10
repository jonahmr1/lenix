#!/bin/bash

SHELL_CONFIG="${HOME}/.zshrc"

if [ -f "${HOME}/.bashrc" ]; then
  SHELL_CONFIG="${HOME}/.bashrc"
fi

echo "===================================="
echo "Lua Modules Setup"
echo "===================================="
echo ""
echo "This script will add the following lines to: $SHELL_CONFIG"
echo ""
echo "# Lua local modules setup"
echo "eval \$(luarocks path --bin)"
echo "export LUA_PATH=\"./lua_modules/share/lua/5.4/?.lua;./lua_modules/share/lua/5.4/?/init.lua;;\""
echo "export LUA_CPATH=\"./lua_modules/lib/lua/5.4/?.so;;\""
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Installation cancelled."
  exit 1
fi

if grep -q "# Lua local modules setup" "$SHELL_CONFIG"; then
  echo "⚠️  Already installed in $SHELL_CONFIG"
  echo "Installation aborted."
  exit 0
fi

echo '' >> "$SHELL_CONFIG"
echo '# Lua local modules setup' >> "$SHELL_CONFIG"
echo 'eval $(luarocks path --bin)' >> "$SHELL_CONFIG"
echo 'export LUA_PATH="./lua_modules/share/lua/5.4/?.lua;./lua_modules/share/lua/5.4/?/init.lua;;"' >> "$SHELL_CONFIG"
echo 'export LUA_CPATH="./lua_modules/lib/lua/5.4/?.so;;"' >> "$SHELL_CONFIG"

source "$SHELL_CONFIG" 2>/dev/null || true

echo ""
echo "✓ Setup complete!"
echo "✓ Added 4 lines to: $SHELL_CONFIG"
echo ""
echo "📦 Usage:"
echo "  luarocks install --tree ./lua_modules <package>"
echo ""
echo "To undo, remove lines containing '# Lua local modules setup' from $SHELL_CONFIG"
echo "Restart your terminal or run: source $SHELL_CONFIG"