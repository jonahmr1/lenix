function BuildConversionTable(export, Category)
  local convertion = {}

  for scriptName, scriptConfig in pairs(Category) do
    if scriptName ~= 'tr_adapter' then
      for _, funcConfig in pairs(scriptConfig) do
        if funcConfig.returns then
          local returns = funcConfig.returns

          for targetField, sourceField in pairs(returns) do
            if type(sourceField) == 'string' and export[sourceField] ~= nil then
              convertion[targetField] = export[sourceField]
            end
          end
        end
      end
    end
  end
  return convertion
end