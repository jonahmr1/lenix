local resourceName = GetCurrentResourceName()

if resourceName == 'tr_lib' then
  lib = {}
  exports('init', function() return lib end)
else
  lib = exports.tr_lib:init()
  require = lib.require
  promise = lib.promise
  console = lib.console
end