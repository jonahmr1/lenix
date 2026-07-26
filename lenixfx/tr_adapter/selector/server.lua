function SelectScripts()
  for _, categoryData in ipairs(SupportedResourcesData) do
    for _, resourceName in ipairs(categoryData.names) do
      local state = GetResourceState(resourceName)
      local foundInServer = false
      for _, serverName in ipairs(ServerResourcesNames) do
        if serverName == resourceName then
          foundInServer = true
          break
        end
      end
      if state == ('started' or 'starting') and not foundInServer then
        print({type = 'success', message = ("✓ Found: %s (Provided by another script)"):format(resourceName), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
      else
        if state == "started" then
          if not AvailableScripts[categoryData.category] then
            AvailableScripts[categoryData.category] = {}
          end
          table.insert(AvailableScripts[categoryData.category], resourceName)
          print({type = 'success', message = ("✓ Started: %s"):format(resourceName), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
        else
          ScriptsToSupport[#ScriptsToSupport + 1] = { category = categoryData.category, name = resourceName }
          print({type = 'info', message = ("✗ Missing: %s"):format(resourceName), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
        end
      end
    end
  end

  RegisterNetEvent('tr_adapter:server:selector_debug', function()
    print({type = 'info', message = ("Found %s scripts to support"):format(#ScriptsToSupport), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
    for _, data in ipairs(ScriptsToSupport) do
      print({type = 'info', message = ("- [%s] %s"):format(data.category, data.name), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
      Wait(300)
    end
    Wait(1000)
    for category, categoryData in pairs(AvailableScripts) do
      for _, scriptName in ipairs(categoryData) do
        print({type = 'info', message = ("%s is going to provide all scripts that are under %s category"):format(scriptName, category), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
        Wait(300)
      end
    end
    print({type = 'info', message = ("Debug finished"):format(#AvailableScripts), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
  end)
  ProvideScripts()
end