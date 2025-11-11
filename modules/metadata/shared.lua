function lib.metadata(keys, resourceName)
  local resource<const> = resourceName or GetInvokingResource()
  assert(resource, ('resourceName is required, got %s'):format(resource))
  assert(type(keys) == 'string' or #keys > 0, ('keys must be a string or array, got %s'):format(type(keys)))

  if not keys then
    return nil
  end

  local metadata = {}

  if type(keys) == 'string' then
    local value<const> = GetResourceMetadata(resource, keys, 0)
    return value
  end

  for _, key in ipairs(keys) do
    local value<const> = GetResourceMetadata(resource, key, 0)
    if value then
      metadata[key] = value
    end
  end

  return metadata
end