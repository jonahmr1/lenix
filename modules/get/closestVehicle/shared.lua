function lib.getPlayerClosestVehicle(radialSpace, source)
  local playerPed<const> = IsDuplicityVersion() and (source and GetPlayerPed(source) or -1) or PlayerPedId()
  local coords<const> = GetEntityCoords(playerPed)
  local vehicles<const> = GetGamePool('CVehicle')

  local closestVehicle = nil
  local closestDistance = radialSpace or 10.0

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
