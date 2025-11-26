local resourceName = GetCurrentResourceName()

if resourceName == 'tr_lib' then
  lib = {}
  exports('init', function() return lib end)
else
  lib = exports.tr_lib:init()
  require = lib.require
  callback = lib.callback
  console = lib.console
  ---@see not tested
  print = config.modules.miscellaneous.enabled and print
end