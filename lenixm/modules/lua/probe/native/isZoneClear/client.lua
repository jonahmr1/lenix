function lib.isZoneClear(inputCoords, radius, exclude)
  assert(inputCoords == nil or type(inputCoords) == "table", ("inputCoords must be a table, got %s"):format(type(inputCoords)))
  assert(radius == nil or type(radius) == "number", ("radius must be a number, got %s"):format(type(radius)))
  assert(exclude == nil or type(exclude) == "table", ("exclude must be a table, got %s"):format(type(exclude)))

  local radial <const> = radius or 10.0
  local coords
  if inputCoords then
    coords = #inputCoords > 0 and { x = inputCoords[1], y = inputCoords[2], z = inputCoords[3]} or inputCoords
  else
    coords = GetEntityCoords(lib.player)
  end

  local pools <const> = { 'Vehicle', 'Object' }

  for i = 1, #pools do
    local entity = lib.closestEntity(coords, radial, pools, exclude)
    if entity then return false end
  end

  local closestPed = lib.closestEntity(coords, radial, {'Ped'}, exclude)
  if closestPed then
    return false
  end

  return true
end