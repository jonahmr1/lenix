local enabledTypes<const> = json.encode(lib.load('config').enabledPrintTypes)
local logTypes<const> = {'error', 'err', 'warning', 'warn', 'info', 'inf', 'success', 'log', 'debug'}

local function createPrint(logType, message, path, line)
  local colors<const> = {
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

  local prefix<const> = string.format('%s[%s]', colors[logType], displayType:upper())
  local location<const> = (path and line) and string.format('(%s:%s)', path, line) or ''
  local output<const> = string.format('%s: %s %s^7', prefix, message, location)

  local baseType = logType
  if logType == 'err' then baseType = 'error'
  elseif logType == 'warn' then baseType = 'warning'
  elseif logType == 'inf' then baseType = 'info'
  end

  for _, enabledType in ipairs(enabledTypes) do
    if enabledType == baseType then
      if baseType == "error" and not path and not line then
        error(message, 2)
      else
        print(output)
      end
      break
    end
  end
  return true, 'Printed successfully'
end

for _, logType in ipairs(logTypes) do
  lib.print[logType] = function(message, path, line)
    createPrint(logType, message, path, line)
  end
end