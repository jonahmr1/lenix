function LoadCompatibilities(categoryData, resourceName)
  local scriptSuccess, scriptError = pcall(function()
    local scriptContent = LoadResourceFile(GetCurrentResourceName(), 'compatibilities/' .. categoryData.category .. '/' .. resourceName .. '/server.lua')
    if not scriptContent then
      print({ type = 'warn', message = ('File not found: %s/%s/server.lua'):format(categoryData.category, resourceName), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
      return
    end

    local chunkScript, errScript = load(scriptContent, '@' .. categoryData.category .. '/' .. resourceName .. '/server.lua')
    if chunkScript then
      chunkScript()
      print({ type = 'info', message = ('Successfully loaded: %s/%s/server.lua'):format(categoryData.category, resourceName), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
    else
      print({ type = 'error', message = ('Failed to compile %s/%s/server.lua: %s'):format(categoryData.category, resourceName, errScript or 'Unknown error'), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
    end
  end)

  if not scriptSuccess then
    print({ type = 'error', message = scriptError, path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
  end
end