local loaded = {}

local package = {
    loaded = setmetatable({}, {
        __index = loaded,
    })
}

function lib.require(modulePath)
    assert(type(modulePath) == 'string', ('Module path must be a string, got %s'):format(type(modulePath)))

    local resourceName, actualPath

    if modulePath:sub(1, 1) == '@' then
        local separatorPos <const> = modulePath:find('/', 2)
        if separatorPos then
            resourceName = modulePath:sub(2, separatorPos - 1)
            actualPath = modulePath:sub(separatorPos + 1)
        else
            lib.console.info(('Invalid module path format: %s'):format(modulePath))
        end
    else
        resourceName = GetInvokingResource() or GetCurrentResourceName()
        actualPath = modulePath
    end

    local cacheKey <const> = resourceName .. ':' .. actualPath

    if package.loaded[cacheKey] then
        return package.loaded[cacheKey]
    end

    local module = ('%s.lua'):format(actualPath)
    local fileContent <const> = LoadResourceFile(resourceName, module)

    if fileContent then
        local chunk <const>, err <const> = load(fileContent, '@' .. resourceName .. '/' .. module)
        if not chunk then
            error(err)
        end
        module = chunk()

        package.loaded[cacheKey] = module
        return module
    else
        lib.console.info(('Module "%s" not found in resource "%s"'):format(module, resourceName))
    end
end