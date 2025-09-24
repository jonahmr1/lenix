exports('print', function(data)
  if type(data) ~= "table" then
    warn(("exports.tr_lib:print expected a table below, but received %s, skipping to native..."):format(type(data)))
    print(data)
    return
  end

  local logType = data.type or "log"
  local message = tostring(data.message or "")

  local colors = {
    error = '^1',
    warning = '^3',
    info = '^4',
    success = '^2',
    log = '^6',
    debug = '^5'
  }

  local prefix = string.format('%s[%s]', colors[logType] or '^7', logType:upper())
  local location = (data.path and data.line) and string.format('(%s:%s)', data.path, data.line) or ""
  local output = data.ignore and string.format('%s: %s^7', prefix, message)
      or string.format('%s: %s %s^7', prefix, message, location)

  for _, enabledType in ipairs(Config.typesEnabled) do
    if enabledType == logType then
      if logType == "error" and not data.path then
        error(message, 2)
      else
        print(output)
      end
      break
    end
  end
end)
