function lib.isZoneClear(inputCoords, radius, includeSelf)
  assert(inputCoords == nil or type(inputCoords) == "table", ("inputCoords must be a table, got %s"):format(type(inputCoords)))
  assert(radius == nil or type(radius) == "number", ("radius must be a number, got %s"):format(type(radius)))
  assert(includeSelf == nil or type(includeSelf) == "boolean", ("includeSelf must be a boolean, got %s"):format(type(includeSelf)))

  local radial <const> = radius or 10.0
  local coords
  if inputCoords then
    coords = #inputCoords > 0 and vec3(inputCoords[1], inputCoords[2], inputCoords[3]) or inputCoords
  else
    coords = GetEntityCoords(lib.player)
  end

  local pools <const> = { 'Vehicle', 'Object' }

  for i = 1, #pools do
    local entity = lib.closestEntity(coords, radial, pools[i])
    if entity then return false end
  end

  local exclude = not includeSelf and lib.player or nil
  local closestPed = lib.closestEntity(coords, radial, 'Ped', exclude)
  if closestPed then
    return false
  end

  return true
end