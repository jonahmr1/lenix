function lib.closestEntity(inputCoords, radialDistance, pool, exclude)
  assert(inputCoords == nil or type(inputCoords) == "table",
    ("inputCoords must be a table, got %s"):format(type(inputCoords)))
  assert(type(radialDistance) == "number", ("radialDistance must be a number, got %s"):format(type(radialDistance)))
  assert(type(pool) == "string", ("pool must be a string, got %s"):format(type(pool)))

  local gamePools <const> = { GetGamePool(('C%s'):format(pool)) }

  local closestEntity = nil
  local closestDistance = radialDistance

  local excludeMap
  if exclude then
    if type(exclude) == "table" then
      excludeMap = {}
      for i = 1, #exclude do
        excludeMap[exclude[i]] = true
      end
    else
      excludeMap = { [exclude] = true }
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
      local distance <const> = #(inputCoords - entityCoords)

      if distance < closestDistance then
        closestDistance = distance
        closestEntity = entity
      end

      ::continue::
    end
  end

  return closestEntity, closestDistance
end