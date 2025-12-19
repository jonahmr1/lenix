AddEventHandler('gameEventTriggered', function()
  lib.player = PlayerPedId()
  lib.source = GetPlayerServerId(PlayerId())
end)