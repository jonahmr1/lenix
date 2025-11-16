local resourceName = GetCurrentResourceName()
if resourceName == 'tr_lib' then
  lib = {}
  exports('loadLibrary', function() return lib end)
else
  lib = exports.tr_lib:loadLibrary()
  require = lib.require
  callback = lib.callback
  console = lib.console
end

AddEventHandler('playerJoining', function()
  local src = source
  lib.source = src
  
  while GetPlayerPed(src) == 0 do
    Wait(0)
  end

  lib.player = GetPlayerPed(src)
end)

AddEventHandler('gameEventTriggered', function()
  lib.player = PlayerPedId()
  lib.source = GetPlayerServerId(PlayerId())
end)