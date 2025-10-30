function lib.metadata(filePath, keys, resourceName)
  local content = LoadResourceFile(resourceName or GetInvokingResource() or GetCurrentResourceName(), filePath)
  
  if not content then
    lib.print.debug(('Could not read file: %s'):format(filePath))
    return nil
  end

  if not keys then
    return content
  end
  
  local metadata = {}
  
  if type(keys) == 'string' then
    keys = {keys}
  end
  
  for _, key in ipairs(keys) do
    local value = content:match(('\n%s%%s*["\']([^"\']+)["\']'):format(key))
    
    if value then
      metadata[key] = value
    end
  end
  
  if #keys == 1 then
    return metadata[keys[1]]
  end
  
  return metadata
end