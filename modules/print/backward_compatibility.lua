local config = require 'config/shared'

exports('print', function(data)
  if type(data) ~= "table" then
    print(data)
    warn(("exports.tr_lib:print expected a table and received %s"):format(type(data):upper()))
    return
  end
  assert(data.type ~= nil, ('invalid print type, received %s'):format(type(data.type):upper()))
  assert(data.message ~= nil, ('invalid print message, received %s'):format(type(data.message):upper()))
  
  local logType = data.type
  local message = data.message
  local colors = {
    error = '^1',
    warning = '^3',
    info = '^4',
    success = '^2',
    log = '^6',
    debug = '^5'
  }

  local prefix = string.format('%s[%s]', colors[logType], logType:upper())
  local location = (data.path and data.line) and string.format('(%s:%s)', data.path, data.line) or ''
  local output = data.ignore and string.format('%s: %s^7', prefix, message) or string.format('%s: %s %s^7', prefix, message, location)

  for _, enabledType in ipairs(config.typesEnabled) do
    if enabledType == logType then
      if logType == "error" and not data.path and not data.line then
        error(message, 2)
      else
        print(output)
      end
      break
    end
  end
end)