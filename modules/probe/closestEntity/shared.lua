function lib.closestEntity(inputCoords, radialDistance, pools, excludes)
  assert(inputCoords == nil or type(inputCoords) == "table", ("inputCoords must be a table, got %s"):format(type(inputCoords)))
  assert(type(radialDistance) == "number", ("radialDistance must be a number, got %s"):format(type(radialDistance)))
  assert(type(pool) == "string", ("pool must be a string, got %s"):format(type(pool)))
  assert(exclude == nil or type(exclude) == "table", ("exclude must be a table, got %s"):format(type(exclude)))

  local inputVec = type(inputCoords.x) == 'number' and vec3(inputCoords.x, inputCoords.y, inputCoords.z) or inputCoords

  local gamePools
  for i = 1, #pools do
    gamePools = gamePools[#gamePools + 1] = GetGamePool(('C%s'):format(pools[i]))
  end

  local closestEntity = nil
  local closestDistance = radialDistance

  local excludeMap
  if exclude then
    excludeMap = {}
    for i = 1, #exclude do
      excludeMap[exclude[i]] = true
    end
  end

  for currentPool = 1, #gamePools do
    local entities <const> = gamePools[currentPool]

    for currentEntity = 1, #entities do
      local entity <const> = entities[currentEntity]

      if excludeMap and excludeMap[entity] then
        goto continue
      end

      local entityCoords <const> = GetEntityCoords(entity)
      local distance <const> = #(inputVec - entityCoords)

      if distance < closestDistance then
        closestDistance = distance
        closestEntity = entity
      end

      ::continue::
    end
  end

  return closestEntity, closestDistance
end