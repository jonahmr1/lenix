local enabledTypes<const> = lib.load('config') and lib.load('config').enabledPrintTypes or repeat Wait(0) until lib.load('config')

-- Map short forms to base types
local typeAliases<const> = {
  err = 'error',
  warn = 'warning',
  inf = 'info'
}

-- Color codes for each base type
local colors<const> = {
  error = '^1',
  warning = '^3',
  info = '^4',
  success = '^2',
  log = '^6',
  debug = '^5'
}

local function normalizeType(logType)
  return typeAliases[logType] or logType
end

local function isTypeEnabled(baseType)
  for _, enabledType in ipairs(enabledTypes) do
    if enabledType == baseType then
      return true
    end
  end
  return false
end

local function createPrint(logType, message, path, line)
  local baseType<const> = normalizeType(logType)
  
  if not isTypeEnabled(baseType) then
    return true, 'Printed successfully'
  end

  -- Handle error type specially
  if baseType == 'error' and not path and not line then
    error(message, 2)
    return true, 'Printed successfully'
  end

  -- Build formatted output
  local color<const> = colors[baseType]
  local prefix<const> = string.format('%s[%s]', color, baseType:upper())
  local location<const> = (path and line) and string.format('(%s:%s)', path, line) or ''
  local output<const> = string.format('%s: %s %s^7', prefix, message, location)
  
  print(output)
  return true, 'Printed successfully'
end

-- Register all log type methods
local logTypes<const> = {'error', 'err', 'warning', 'warn', 'info', 'inf', 'success', 'log', 'debug'}

for _, logType in ipairs(logTypes) do
  lib.print[logType] = function(message, path, line)
    createPrint(logType, message, path, line)
  end
end