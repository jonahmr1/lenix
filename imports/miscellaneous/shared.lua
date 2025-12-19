local _print<const> = print

function print(...)
  local parts = {}
  for i = 1, select('#', ...) do
    local arg<const> = select(i, ...)
    if type(arg) == 'table' then
      local encoded = json.encode(arg, { indent = config.modules.miscellaneous.indent })
      encoded = encoded:gsub('"', '')
      table.insert(parts, encoded)
    else
      table.insert(parts, tostring(arg))
    end
  end

  for i = 1, #parts do
    _print(parts[i])
  end
end

AddEventHandler('onResourceStop', function(resourceName)
  if resourceName == GetCurrentResourceName() then
    lib.console.fatal(('%s just stopped, please restart your server'):format(GetCurrentResourceName()))
  end
end)