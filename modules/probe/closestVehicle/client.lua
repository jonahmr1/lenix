function lib.getPlayerClosestVehicle(radialSpace)
  assert(type(radialSpace) == 'number', ('radialSpace must be a number, received (%s)'):format(radialSpace))

  local playerPed<const> = PlayerPedId()
  local coords<const> = GetEntityCoords(playerPed)
  local vehicles<const> = GetGamePool('CVehicle')

  local closestVehicle = nil
  local closestDistance = radialSpace

  for i = 1, #vehicles do
    local vehicle<const> = vehicles[i]
    local vehCoords<const> = GetEntityCoords(vehicle)
    local distance<const> = #(coords - vehCoords)

    if distance < closestDistance then
      closestDistance = distance
      closestVehicle = vehicle
    end
  end

  return closestVehicle
end
