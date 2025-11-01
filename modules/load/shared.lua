local moduleCache = {}

function lib.load(path, resourceName)
    resourceName = resourceName or GetInvokingResource() or GetCurrentResourceName()
    assert(resourceName, 'No resource could be found')
    assert(path, 'No path could be found')

    local cacheKey = resourceName .. ':' .. path
    
    if moduleCache[cacheKey] then
        return moduleCache[cacheKey]
    end
    
    local data
    local file = LoadResourceFile(resourceName, path .. '.json')

    if file then
        data = json.decode(file)
    else
        file = LoadResourceFile(resourceName, path .. '.lua')
        if file then
            local chunk = load(file, '@' .. resourceName .. '/' .. path)
            if chunk then
                data = chunk()
            end
        end
    end
    
    if data then
        moduleCache[cacheKey] = data
    end
    return data
end