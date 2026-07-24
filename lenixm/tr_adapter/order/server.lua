function InitOrder(Category, convertion, functionName, called)
  local functionSettings = Category[called][functionName].returns
  if functionSettings == nil then return nil, 'tr_adapter is identifying this function as a none returnal function' end
  if next(functionSettings) == nil then
    print({type = 'error', message = 'tr_adapter still doesn\'t support this function'})
    return nil, 'tr_adapter still doesn\'t support this function'
  end
  for missingArg, _ in pairs(functionSettings) do
    for shopArg, shopValue in pairs(convertion) do
      if missingArg == shopArg then
        functionSettings[missingArg] = shopValue
      end
    end
  end
  return functionSettings
end