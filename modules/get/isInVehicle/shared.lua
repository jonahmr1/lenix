function lib.isInVehicle(source)
  local player<const> = IsDuplicityVersion() and (source and GetPlayerPed(source) or -1) or PlayerPedId()
  return GetVehiclePedIsIn(player, false)
end