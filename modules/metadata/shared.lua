function lib.metadata(keys, resourceName)
  local resource = resourceName or GetInvokingResource() or GetCurrentResourceName()

  if not keys then
    return nil
  end
  
  local metadata = {}
  
  if type(keys) == 'string' then
    local value = GetResourceMetadata(resource, keys, 0)
    return value
  end
  
  for _, key in ipairs(keys) do
    local value = GetResourceMetadata(resource, key, 0)
    if value then
      metadata[key] = value
    end
  end
  
  return metadata
end