function lib.resources()
    local numResources<const> = GetNumResources()
    local resources = {}
    for i = 0, numResources - 1 do
        local resourceName = GetResourceByFindIndex(i)
        if resourceName then
            table.insert(resources, resourceName)
        end
    end
    return resources
end