function lib.metadata(keys, resourceName)
  local resource<const> = resourceName or GetInvokingResource()

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