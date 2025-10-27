local function split(str, delimiter)
  delimiter = delimiter or ','
  local result = {}
  for match in string.gmatch(str, "([^" .. delimiter .. "]+)") do
    table.insert(result, match)
  end
  return result
end

return split