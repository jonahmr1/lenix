local moduleCache = {}

local function load(path)
    if moduleCache[path] then
        return moduleCache[path]
    end
    
    local data
    
    local file = LoadResourceFile(GetCurrentResourceName(), path .. '.json')
    if file then
        data = json.decode(file)
    else
        file = LoadResourceFile(GetCurrentResourceName(), path .. '.lua')
        if file then
            local chunk = load(file, path)
            if chunk then
                data = chunk()
            end
        end
    end
    
    if data then
        moduleCache[path] = data
    end
    
    return data
end

return load