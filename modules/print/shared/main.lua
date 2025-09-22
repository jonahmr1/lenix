exports('print', function(type, ...)
  local color = type == 'error' and '^1' or type == 'warn' and '^3' or type == 'info' and '^4' or type == 'success' and '^2' or type == 'log' and '^6' or type == 'debug' and '^5' or exports.tr_lib:print(('Invalid type of print (%s)'):format(type), 'error')
  for i = 1, #Config.typesEnabled do
    if Config.typesEnabled[i] == type then
      print(('%s [%s]: %s ^7'):format(color, type:upper(), ...))
    end
  end
end)