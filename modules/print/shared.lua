local enabledTypes<const> = lib.loadModule 'config'
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

  for _, enabledType in ipairs(enabledTypes.enabledPrintTypes) do
    if enabledType == baseType then
      if baseType == "error" and not path and not line then
        error(message, 2)
      else
        print(output)
      end
      break
    end
  end
end

local function backwardCompatPrint(data)
  if type(data) ~= "table" then
    print(data)
    warn(("exports.tr_lib:print expected a table and received %s"):format(type(data):upper()))
    return
  end
  assert(data.type ~= nil, ('invalid print type, received %s'):format(type(data.type):upper()))
  assert(data.message ~= nil, ('invalid print message, received %s'):format(type(data.message):upper()))

  local logType<const> = data.type
  local message<const> = data.message

  createPrint(logType, message, data.path, data.line)
end


for _, logType in ipairs(logTypes) do
  lib.print[logType] = function(message, path, line)
    if type(message) == "table" then
      backwardCompatPrint(message)
      return
    end
    createPrint(logType, message, path, line)
  end
end

lib.print.legacy = backwardCompatPrint --[[ for psychopaths XD ]]