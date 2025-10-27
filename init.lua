-- Module registry: Maps module names to their file paths
local moduleMap = {
  print = '@tr_lib/modules/print/shared',
  callback = IsDuplicityVersion() and '@tr_lib/modules/callback/server' or '@tr_lib/modules/callback/client',
  split = '@tr_lib/modules/split/shared',
  load = '@tr_lib/modules/load/shared',
  require = '@tr_lib/modules/require/shared',
}

-- Cache for loaded modules
local cache = {}

-- Create the lib proxy with lazy loading
local lib = setmetatable({}, {
  __index = function(t, moduleName)
    -- Check if already cached
    if cache[moduleName] then
      return cache[moduleName]
    end
    
    -- Get module path from registry
    local modulePath = moduleMap[moduleName]
    
    if not modulePath then
      error("Module '" .. tostring(moduleName) .. "' not found in lib registry", 2)
    end
    
    -- Load the module on-demand
    local success, module = pcall(require, modulePath)
    
    if not success then
      error("Failed to load module '" .. moduleName .. "': " .. tostring(module), 2)
    end
    
    -- Cache the loaded module
    cache[moduleName] = module
    
    -- Set it directly on the table (optimization: bypasses __index next time)
    rawset(t, moduleName, module)
    
    return module
  end,
  
  __newindex = function(t, key, value)
    error("Cannot modify lib table. Modules are read-only.", 2)
  end
})

-- Make lib globally available immediately (before any modules load)
_G.lib = lib

-- Export commonly used functions
-- Note: These will trigger lazy loading on first access
exports('require', function() return lib.require end)
exports('print', function() return lib.print end)

-- Return the proxy
return lib