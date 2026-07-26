local utils = {}

-- Lua implementation of your TS deepMerge
local function deepMerge(target, source)
  for key, sourceValue in pairs(source) do
    local targetValue = target[key]

    if type(sourceValue) == 'table' and type(targetValue) == 'table' then
      -- In Lua, we check if it's a "dictionary" (object) vs "array" 
      -- using tr_lib or standard checks if necessary, but for your config,
      -- a recursive table merge is the direct equivalent.
      target[key] = deepMerge(utils.tableFiller({}, targetValue), sourceValue)
    else
      target[key] = sourceValue
    end
  end
  return target
end

-- Lua implementation of tableFiller
function utils.tableFiller(...)
  local objects = { ... }
  local result = {}

  for i = 1, #objects do
    local obj = objects[i]
    if obj ~= nil and type(obj) == 'table' then
      deepMerge(result, obj)
    end
  end

  return result
end

return utils