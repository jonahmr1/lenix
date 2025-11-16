local checkReleaseVersionInstead<const> = lib.require('config').checkReleaseVersionInstead
local excludedFromVersion<const> = lib.require('config').excludedFromVersion
lib.version = {}

local function getResourceMetadata(currentVersion, resourceName, repositoryURL)
  local metadata <const> = {
    version = currentVersion or lib.metadata('version', resourceName),
    repository = repositoryURL or lib.metadata('repository', resourceName)
  }
  return metadata
end

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
    return false, ('Could not retrieve repository\'s content, got statusCode: %s from %s'):format(statusCode, apiUrl)
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
          lib.version.release(metadata.repository, metadata.version, resource)
        else
          lib.version.source(metadata.repository, metadata.version, resource)
        end
      end
    end
  end
end)

return {
  getResourceMetadata = getResourceMetadata,
  parseGithubRepo = parseGithubRepo,
  getRepositoryResponse = getRepositoryResponse,
}