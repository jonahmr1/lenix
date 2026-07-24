---@diagnostic disable: duplicate-set-field

function lib.isInVehicle(source)
  assert(type(source) == 'number', ('source must be a number, received (%s)'):format(source))

  local player<const> = GetPlayerPed(source)
  return GetVehiclePedIsIn(player, false)
end