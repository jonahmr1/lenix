local parseGithubRepo = lib.require('modules/version/server').parseGithubRepo
local getRepositoryResponse = lib.require('modules/version/server').getRepositoryResponse

local function getSourceVersion(response, metadata, resourceName)
  local remoteVersion <const> = response:match('\nversion%s*["\']([^"\']+)["\']')

  if remoteVersion and remoteVersion ~= metadata.version then
    lib.console.info(('Unmatched versions available for %s\nCurrent: %s | Latest: %s\nRepository: %s'):format(
      resourceName,
      metadata.version,
      remoteVersion,
      metadata.repository
    ))
    return false, remoteVersion
  else
    lib.console.info(('%s is up to date (v%s)'):format(resourceName, metadata.version))
    return true, metadata.version
  end
end

function lib.version.source(repository, version, resourceName)
  assert(repository, ('No repository provided, got %s'):format(repository))

  local metadata <const> = {
    version = version,
    repository = repository
  }

  local owner, repoName = parseGithubRepo(metadata.repository)
  assert((owner and repoName) ~= nil, ('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  local response<const> = getRepositoryResponse(('https://raw.githubusercontent.com/%s/%s/refs/heads/main/fxmanifest.lua'):format(owner, repoName))
  assert(response ~= nil, 'Failed to get repository response')

  return getSourceVersion(response, metadata, resourceName or GetInvokingResource())
end