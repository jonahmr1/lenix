function lib.split(str, delimiter)
  assert(type(str) == 'string', ('str must be a string, got %s'):format(type(str)))
  assert(type(delimiter) == 'string', ('delimiter must be a string, got %s'):format(type(delimiter)))

  delimiter = delimiter or ','
  local result = {}
  for match in string.gmatch(str, "([^" .. delimiter .. "]+)") do
    table.insert(result, match)
  end
  return result
end