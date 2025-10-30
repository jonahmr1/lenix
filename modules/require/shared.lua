local loaded = {}

local package = {
    loaded = setmetatable({}, {
        __index = loaded,
    })
}

function require(localLoad, modulePath)
    if type(localLoad) ~= 'boolean' then
        return require(false, localLoad)
    end
    assert(modulePath, 'Module path caught nil')

    local resourceName, actualPath
    
    if modulePath:sub(1, 1) == '@' then
        local separatorPos<const> = modulePath:find('/', 2)
        if separatorPos then
            resourceName = modulePath:sub(2, separatorPos - 1)
            actualPath = modulePath:sub(separatorPos + 1)
        else
            error('Invalid module path format: ' .. modulePath)
        end
    else
        resourceName = localLoad and GetCurrentResourceName() or GetInvokingResource()
        actualPath = modulePath
    end
    
    local cacheKey<const> = resourceName .. ':' .. actualPath
    
    if package.loaded[cacheKey] then
        return package.loaded[cacheKey]
    end

    local module = ('%s.lua'):format(actualPath)
    local fileContent<const> = LoadResourceFile(resourceName, module)

    if fileContent then
        local chunk<const>, err<const> = load(fileContent, '@' .. resourceName .. '/' .. module)
        if not chunk then
            error(err)
        end
        module = chunk()

        package.loaded[cacheKey] = module
        return module
    else
        error('Module "' .. actualPath .. '" not found in resource "' .. resourceName .. '"')
    end
end