function lib.resources(exclude)
    local numResources<const> = GetNumResources()
    local resources = {}
    
    local excludeSet = {}
    if exclude then
        if type(exclude) == 'table' then
            for _, name in ipairs(exclude) do
                excludeSet[name] = true
            end
        else
            excludeSet[exclude] = true
        end
    end
    
    for i = 0, numResources - 1 do
        local resourceName<const> = GetResourceByFindIndex(i)
        if not excludeSet[resourceName] then
            resources[#resources + 1] = resourceName
        end
    end
    
    return resources
end