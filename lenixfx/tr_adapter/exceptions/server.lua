function LoadExceptions(categoryData)
  local success, error = pcall(function()
    local initContent = LoadResourceFile(GetCurrentResourceName(), 'compatibilities/' .. categoryData.category .. '/_exception/server.lua')
    if not initContent then
      print({ type = 'warn', message = ('Init file not found: %s/_exception/server.lua'):format(categoryData.category), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
    else
      local chunkInit, errInit = load(initContent, '@' .. categoryData.category .. '/_exception/server.lua')
      if chunkInit then
        chunkInit()
        print({ type = 'info', message = ('Successfully loaded: %s/_exception/server.lua'):format(categoryData.category), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
      else
        print({ type = 'error', message = ('Failed to compile %s/_exception/server.lua: %s'):format(categoryData.category, errInit or 'Unknown error'), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
      end
    end
  end)

  if not success then
    print({ type = 'error', message = error, path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
  end
end