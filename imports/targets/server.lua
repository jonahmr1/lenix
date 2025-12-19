AddEventHandler('playerJoining', function()
  local src = source
  lib.source = src

  while GetPlayerPed(src) == 0 do
    Wait(0)
  end

  lib.player = GetPlayerPed(src)
end)