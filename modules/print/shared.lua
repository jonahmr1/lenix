local config = require 'config/shared'

local function createPrint(logType, message, path, line)
  local colors = {
    error = '^1',
    err = '^1',
    warning = '^3',
    warn = '^3',
    info = '^4',
    inf = '^4',
    success = '^2',
    log = '^6',
    debug = '^5'
  }

  local displayType = logType
  if logType == 'err' then displayType = 'error'
  elseif logType == 'warn' then displayType = 'warning'
  elseif logType == 'inf' then displayType = 'info'
  end

  local prefix = string.format('%s[%s]', colors[logType], displayType)
  local location = (path and line) and string.format('(%s:%s)', path, line) or ''
  local output = string.format('%s: %s %s^7', prefix, message, location)

  local baseType = logType
  if logType == 'err' then baseType = 'error'
  elseif logType == 'warn' then baseType = 'warning'
  elseif logType == 'inf' then baseType = 'info'
  end

  for _, enabledType in ipairs(config.typesEnabled) do
    if enabledType == baseType then
      if path and line then
        print(output)
      else
        if logType == "error" or logType == 'err' then
          error(message, 2)
        elseif logType == 'warning' or logType == 'warn' then
          warn(message)
        elseif logType == 'debug' then
          warn('We really encourage you inserting with DEBUG MODE the PATH and LINE')
          print(output)
        else
          print(output)
        end
      end
      break
    end
  end
end

local printFunc = {}

local logTypes = {'error', 'err', 'warning', 'warn', 'info', 'inf', 'success', 'log', 'debug'}
for _, logType in ipairs(logTypes) do
  printFunc[logType] = function(message, path, line)
    createPrint(logType, message, path, line)
  end
end

setmetatable(printFunc, {
  __call = function(_, message, ...)
    warn("No print type called, native fallback...")
    print(message)
  end
})

exports('print', function(message, ...)
  if message ~= nil then
    warn("No print type called, native fallback...")
    print(message)
    return printFunc
  end
  
  return printFunc
end)