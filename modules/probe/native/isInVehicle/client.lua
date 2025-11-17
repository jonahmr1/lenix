---@diagnostic disable: duplicate-set-field

function lib.isInVehicle()
  local player<const> = PlayerPedId()
  return GetVehiclePedIsIn(player, false)
end