local loaded = {}
package = {
    loaded = setmetatable({}, {
        __index = loaded,
    })
}
local function require(modulePath)
    local resourceName = GetInvokingResource() or GetCurrentResourceName()
    assert(modulePath, 'Module path caught nil')
    if package.loaded[modulePath] then
        return package.loaded[modulePath]
    end

    local module = ('%s.lua'):format(modulePath)
    local fileContent = LoadResourceFile(resourceName, module)

    if fileContent then
        local chunk, err = load(fileContent, '@' .. resourceName .. '/' .. module)
        if not chunk then
            error(err)
        end
        module = chunk()

        package.loaded[modulePath] = module
        return module
    else
        error('Module "' .. modulePath .. '" not found in resource "' .. resourceName .. '"')
    end
end

exports('require', require)
