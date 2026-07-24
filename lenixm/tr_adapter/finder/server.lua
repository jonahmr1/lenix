local numResources = GetNumResources()

for i = 0, numResources - 1 do
  local resourceName = GetResourceByFindIndex(i)
  if resourceName then
    table.insert(ServerResourcesNames, resourceName)
  end
end

print({type = 'info', message = ('Found %s resources'):format(#ServerResourcesNames), path = debug.getinfo(1, "Sl").short_src, line = debug.getinfo(1, "Sl").currentline})
ExtractResourceNames()