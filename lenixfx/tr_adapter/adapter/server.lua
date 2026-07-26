function AdapterSetup()
  for categoryVariable, _ in pairs(Categories) do
    local category = (categoryVariable):lower()
    local categoryName = _G[categoryVariable]
    local handler = AvailableScripts[category][1]
    for resourceName, functionsObject in pairs(categoryName) do
      for functionName, functionConfig in pairs(functionsObject) do
        if not ScriptsFunctions[category] then
          ScriptsFunctions[category] = {}
        end
        table.insert(ScriptsFunctions[category], functionName)
        if resourceName ~= handler and resourceName ~= 'tr_adapter' then
          categoryName.tr_adapter[functionName] = function(calledResource, handlerResource, ...)
            local param = { ... }
            local convertion = InitENV(categoryName, handlerResource, functionName, param, calledResource)
            print(json.encode(convertion))
            local functionSettings = InitOrder(categoryName, convertion, functionName, calledResource)
            print(json.encode(functionSettings))

            return functionSettings
          end

          AddEventHandler(('__cfx_export_%s_%s'):format(resourceName, functionConfig.label), function(cb)
            cb(function(...)
              return categoryName.tr_adapter[functionName](resourceName, handler, ...)
            end)
          end)
        end
      end
    end
  end
end
