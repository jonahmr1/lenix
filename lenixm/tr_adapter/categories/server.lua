function GenerateCategories()
  for _, categoryData in ipairs(SupportedResourcesData) do
    local categoryVariable = string.upper(string.sub(categoryData.category, 1, 1)) .. string.sub(categoryData.category, 2)

    if not _G[categoryVariable] then
      _G[categoryVariable] = {}
    end

    if not Categories[categoryVariable] then
      Categories[categoryVariable] = {}
    end

    if not _G[categoryVariable]['tr_adapter'] then
      _G[categoryVariable]['tr_adapter'] = {}
    end

    for _, resourceName in ipairs(categoryData.names) do
      _G[categoryVariable][resourceName] = {}

      table.insert(Categories[categoryVariable], {
        name = resourceName
      })
    end
  end
end