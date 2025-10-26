function BackwardCompatPrint(data)
  if type(data) ~= "table" then
    print(data)
    warn(("exports.tr_lib:print expected a table and received %s"):format(type(data):upper()))
    return
  end
  assert(data.type ~= nil, ('invalid print type, received %s'):format(type(data.type):upper()))
  assert(data.message ~= nil, ('invalid print message, received %s'):format(type(data.message):upper()))
  
  local logType<const> = data.type
  local message<const> = data.message
  
  CreatePrint(logType, message, data.path, data.line)
end