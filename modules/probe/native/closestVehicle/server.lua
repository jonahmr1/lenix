---@diagnostic disable: duplicate-set-field

function lib.closestVehicle(entity, radialSpace, source)
  assert(type(entity) == 'number', ('entity must be a number, received (%s)'):format(radialSpace))
  assert(type(radialSpace) == 'number', ('radialSpace must be a number, received (%s)'):format(radialSpace))
  assert(type(source) == 'number', ('source must be a number, received (%s)'):format(source))

  local coords<const> = GetEntityCoords(entity)
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