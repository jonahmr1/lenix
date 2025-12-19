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

  local module, fileContent

  fileContent = LoadResourceFile(resourceName, actualPath .. '.lua')
  if fileContent then
    local chunk <const>, err <const> = load(fileContent, '@' .. resourceName .. '/' .. actualPath .. '.lua')
    if not chunk then
      error(err)
    end
    module = chunk()
  else
    fileContent = LoadResourceFile(resourceName, actualPath .. '.json')
    if fileContent then
      module = json.decode(fileContent)
    else
      lib.console.info(('Module "%s.lua" or "%s.json" not found in resource "%s"'):format(actualPath, actualPath,
        resourceName))
    end
  end

  if module then
    package.loaded[cacheKey] = module
  end

  return module
end

---@deprecated
exports('require', lib.require)