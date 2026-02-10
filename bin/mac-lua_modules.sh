#!/bin/bash

# Detect actual shell
SHELL_CONFIG="${HOME}/.bashrc"

if [[ "$SHELL" == *"zsh"* ]]; then
  SHELL_CONFIG="${HOME}/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
  # Bash needs .bash_profile to source .bashrc
  SHELL_CONFIG="${HOME}/.bashrc"
  PROFILE_CONFIG="${HOME}/.bash_profile"
fi

# Create shell config if it doesn't exist
touch "$SHELL_CONFIG"

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
echo '# Lua local modules end.' >> "$SHELL_CONFIG"

# For bash, ensure .bash_profile sources .bashrc
if [[ "$SHELL" == *"bash"* ]] && [ -n "$PROFILE_CONFIG" ]; then
  if [ ! -f "$PROFILE_CONFIG" ] || ! grep -q "source.*bashrc" "$PROFILE_CONFIG"; then
    echo '' >> "$PROFILE_CONFIG"
    echo '# Source .bashrc' >> "$PROFILE_CONFIG"
    echo 'if [ -f ~/.bashrc ]; then source ~/.bashrc; fi' >> "$PROFILE_CONFIG"
  fi
fi

source "$SHELL_CONFIG" 2>/dev/null || true

echo ""
echo "✓ Setup complete!"
echo "✓ Added to: $SHELL_CONFIG"
echo ""
echo "📦 Usage:"
echo "  luarocks install --tree ./lua_modules <package>"
echo ""
echo "⚠️  IMPORTANT: Restart your terminal for changes to take effect"
echo ""
echo "To undo, remove lines containing '# Lua local modules setup' from $SHELL_CONFIG"