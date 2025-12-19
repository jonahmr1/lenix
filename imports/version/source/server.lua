local getResourceMetadata = lib.require('imports/version/server').getResourceMetadata
local parseGithubRepo = lib.require('imports/version/server').parseGithubRepo
local getRepositoryResponse = lib.require('imports/version/server').getRepositoryResponse

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
    lib.console.info(('%s source is up to date (%s)'):format(resourceName, metadata.version))
    return true, metadata.version
  end
end

function lib.version.source(repositoryURL, currentVersion, targetResourceName)
  local resourceName<const> = targetResourceName or GetInvokingResource() or GetCurrentResourceName()

  local metadata <const> = getResourceMetadata(currentVersion, resourceName, repositoryURL)

  assert(metadata.repository, ('Got %s from %s\'s fxmanifest, pass repository URL argument or update your fxmanifest'):format(metadata.repository, resourceName))
  local owner, repoName = parseGithubRepo(metadata.repository)
  assert((owner and repoName) ~= nil, ('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  local apiURL<const> = ('https://raw.githubusercontent.com/%s/%s/refs/heads/main/fxmanifest.lua'):format(owner, repoName)
  local success<const>, response<const> = getRepositoryResponse(apiURL)
  if not success then
    return success, response
  end

  return getSourceVersion(response, metadata, resourceName)
end