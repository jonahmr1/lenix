function LoadScripts()
  local loadedCategories = {}
  GenerateCategories()
  for _, categoryData in ipairs(SupportedResourcesData) do
    for _, resourceName in ipairs(categoryData.names) do
      LoadCompatibilities(categoryData, resourceName)
    end
    
    if not loadedCategories[categoryData.category] then
      LoadExceptions(categoryData)

      loadedCategories[categoryData.category] = true
    end
  end

  if next(SupportedResourcesData) then
    AdapterSetup()
  else
    print({ type = 'error', message = 'Functions Initialization failed, No available script found, double check the fxmanifest', path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline })
  end
end

CreateThread(function()
  TriggerEvent('tr_adapter:server:extractor_debug')
  while not ExtractorDebuggerFinished do Wait(1000) end
  TriggerEvent('tr_adapter:server:selector_debug')
end)