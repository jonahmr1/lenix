---@diagnostic disable: duplicate-set-field

Inventory.tr_adapter.GetTargetItem = function(called, param, functionName, convertion)
  local functionSettings
  if called == 'ox_inventory' then
    if param[2] == 1 then
      functionSettings = Inventory[called][functionName].returns
      for missingArg, _ in pairs(functionSettings) do
        for shopArg, shopValue in pairs(convertion) do
          if missingArg == shopArg then
            functionSettings[missingArg] = shopValue
          end
        end
      end
    elseif param[2] == 2 then
      functionSettings = Inventory[called][functionName].returns
      for missingArg, _ in pairs(functionSettings) do
        for shopArg, shopValue in pairs(convertion) do
          if shopArg == 'count' and missingArg == 'count' then
            functionSettings = shopValue
            break
          end
        end
      end
    end
  elseif called == 'qb-inventory' then
    functionSettings = Inventory[called][functionName].returns
    for missingArg, missingValue in pairs(functionSettings) do
      if missingValue == 'image' then
        assert(convertion.name ~= nil, 'convertion.name is nil')
        functionSettings[missingArg] = (convertion.name) .. '.png'
      else
        for shopArg, shopValue in pairs(convertion) do
          if missingArg == shopArg then
            functionSettings[missingArg] = shopValue
          end
        end
      end
    end
  end
  return functionSettings
end