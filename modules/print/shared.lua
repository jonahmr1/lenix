local types<const> = exports.tr_lib:load 'config'

function CreatePrint(logType, message, path, line)
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

  for _, enabledType in ipairs(types.enabledPrintTypes) do
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

local printFunc<const> = {
  error = function(message, path, line)
    CreatePrint('error', message, path, line)
  end,
  err = function(message, path, line)
    CreatePrint('err', message, path, line)
  end,
  warning = function(message, path, line)
    CreatePrint('warning', message, path, line)
  end,
  warn = function(message, path, line)
    CreatePrint('warn', message, path, line)
  end,
  info = function(message, path, line)
    CreatePrint('info', message, path, line)
  end,
  inf = function(message, path, line)
    CreatePrint('inf', message, path, line)
  end,
  success = function(message, path, line)
    CreatePrint('success', message, path, line)
  end,
  log = function(message, path, line)
    CreatePrint('log', message, path, line)
  end,
  debug = function(message, path, line)
    CreatePrint('debug', message, path, line)
  end,
  legacy = BackwardCompatPrint --[[ for psychopaths XD ]]
}

exports('print', function(data, path, line)
  if type(data) == "table" then
    BackwardCompatPrint(data)
    return
  end
  
  return printFunc
end)