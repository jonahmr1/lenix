local parseGithubRepo = lib.require('modules/version/server').parseGithubRepo
local getRepositoryResponse = lib.require('modules/version/server').getRepositoryResponse

local function getReleaseVersion(tag_name, metadata, resourceName, owner, repoName)
  local remoteVersion <const> = tag_name:gsub('^v', '')
  local currentVersion <const> = metadata.version:gsub('^v', '')

  if remoteVersion ~= currentVersion then
    lib.console.info(('New release available for %s\nCurrent: %s | Found: %s\nDownload Latest: %s'):format(
      resourceName,
      currentVersion,
      remoteVersion,
      ('https://github.com/%s/%s/releases/latest'):format(owner, repoName)
    ))
    return false, remoteVersion
  else
    lib.console.info(('%s is up to date (%s)'):format(resourceName, currentVersion))
    return true, currentVersion
  end
end

function lib.version.release(repository, version, resourceName)
  assert(repository, ('No repository provided, got %s'):format(repository))

  local metadata <const> = {
    version = version,
    repository = repository
  }

  local owner <const>, repoName = parseGithubRepo(metadata.repository)
  assert((owner and repoName) ~= nil, ('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  local response = getRepositoryResponse(owner, repoName, ('https://api.github.com/repos/%s/%s/releases/latest'):format(owner, repoName))
  assert(response.tag_name ~= nil, 'No tag_name found in GitHub API response')

  return getReleaseVersion(response.tag_name, metadata, resourceName or GetInvokingResource(), owner, repoName)
end