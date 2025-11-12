local checkReleaseVersionInstead<const> = lib.load('config', GetCurrentResourceName()).checkReleaseVersionInstead
local excludedFromVersion<const> = lib.load('config', GetCurrentResourceName()).excludedFromVersion
lib.version = {}

local function getApiVoid(apiUrl, cb)
  PerformHttpRequest(apiUrl, function(statusCode, response)
    assert(statusCode == 200, ('Failed to check repository status, got status code: %s'):format(statusCode))
    if cb then
      cb(response)
    end
  end, 'GET', '', { ['Content-Type'] = 'application/json' })
end

local function parseGithubRepo(repository)
  local cleanPath = lib.filter(repository, 'https://', 'http://', 'github.com/', '%.git$')
  local owner, repoName = cleanPath:match('^([^/]+)/([^/]+)')
  assert(owner ~= nil and repoName ~= nil,('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  return owner, repoName
end

local function getRepositoryResponse(apiUrl)
  getApiVoid(apiUrl, function (data)
    local success, response<const> = pcall(json.decode, data)
    assert(success, 'Failed to decode GitHub API response')

    return response
  end)
end

AddEventHandler('onResourceStart', function(resourceName)
  if resourceName == 'tr_lib' then
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