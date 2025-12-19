local getResourceMetadata = lib.require('imports/version/server').getResourceMetadata
local parseGithubRepo = lib.require('imports/version/server').parseGithubRepo
local getRepositoryResponse = lib.require('imports/version/server').getRepositoryResponse

local function getReleaseVersion(tag_name, metadata, resourceName, owner, repoName)
  local remoteVersion <const> = tag_name:gsub('^v', '')
  local releaseTag <const> = metadata.version

  if remoteVersion ~= releaseTag then
    lib.console.info(('New release available for %s\nCurrent: %s | Found: %s\nDownload Latest: %s'):format(
      resourceName,
      releaseTag,
      remoteVersion,
      ('https://github.com/%s/%s/releases/latest'):format(owner, repoName)
    ))
    return false, remoteVersion
  else
    lib.console.info(('%s release is up to date (%s)'):format(resourceName, releaseTag))
    return true, releaseTag
  end
end

function lib.version.release(repositoryURL, releaseTag, targetResourceName)
  local resourceName<const> = targetResourceName or GetInvokingResource() or GetCurrentResourceName()

  local metadata = getResourceMetadata(releaseTag, resourceName, repositoryURL)

  assert(metadata.repository, ('Got %s from %s\'s fxmanifest, pass repository URL argument or update your fxmanifest'):format(metadata.repository, resourceName))
  local owner <const>, repoName = parseGithubRepo(metadata.repository)
  assert((owner and repoName) ~= nil, ('Failed to parse the repository, got owner: %s, repoName: %s'):format(owner, repoName))

  local success<const>, response<const> = getRepositoryResponse(('https://api.github.com/repos/%s/%s/releases/latest'):format(owner, repoName))
  if not success then
    return success, response
  end

  if response then
    local decodedResponse<const> = json.decode(response)
    local tag_name<const> = decodedResponse?.tag_name
    if not tag_name then
      return success, ('Could not retrieve %s\'s tag name'):format(repoName)
    end
    _G.tag_name = tag_name
  end

  return getReleaseVersion(tag_name, metadata, resourceName, owner, repoName)
end