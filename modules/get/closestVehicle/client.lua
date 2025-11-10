function lib.getPlayerClosestVehicle(radialSpace)
  local playerPed = PlayerPedId()
  local coords = GetEntityCoords(playerPed)
  local vehicles = GetGamePool('CVehicle')

  local closestVehicle = nil
  local closestDistance = radialSpace or 10.0

  for i = 1, #vehicles do
    local vehicle = vehicles[i]
    local vehCoords = GetEntityCoords(vehicle)
    local distance = #(coords - vehCoords)

    if distance < closestDistance then
      closestDistance = distance
      closestVehicle = vehicle
    end
  end

  return closestVehicle
end
