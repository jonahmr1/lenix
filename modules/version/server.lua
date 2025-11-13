local checkReleaseVersionInstead<const> = lib.load('config', GetCurrentResourceName()).checkReleaseVersionInstead
local excludedFromVersion<const> = lib.load('config', GetCurrentResourceName()).excludedFromVersion
lib.version = {}

local function parseGithubRepo(repository)
  local cleanPath = lib.filter(repository, 'https://', 'http://', 'github.com/', '%.git$')
  local owner, repoName = cleanPath:match('^([^/]+)/([^/]+)')
  assert(owner ~= nil and repoName ~= nil,('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  return owner, repoName
end

local function getRepositoryResponse(apiUrl)
  local statusCode, response = PerformHttpRequestAwait(apiUrl)
  while statusCode == nil do
    Wait(0)
  end
  if statusCode == 200 then
    return true, response
  else
    lib.console.info(('Failed to access repository\'s fxmanifest, got statusCode: %s from %s'):format(statusCode, apiUrl))
  end
end

AddEventHandler('onResourceStart', function(resourceName)
  if GetCurrentResourceName() == resourceName then
    local resources<const> = lib.resources(excludedFromVersion)
    for i = 1, #resources do
      local resource<const> = resources[i]
      local metadata<const> = lib.metadata({ 'version', 'repository' }, resource)

      if metadata and metadata.repository then
        if checkReleaseVersionInstead then
          lib.version.release(metadata.repository, metadata.version)
        else
          lib.version.source(metadata.repository, metadata.version)
        end
      end
    end
  end
end)

return {
  parseGithubRepo = parseGithubRepo,
  getRepositoryResponse = getRepositoryResponse,
}