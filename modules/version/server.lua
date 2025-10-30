local function checkVersion(metadata, resourceName)
  if not metadata.repository then return end
  local rawUrl<const> = metadata.repository:gsub('github%.com', 'raw.githubusercontent.com'):gsub('/blob/', '/') .. '/refs/heads/main/fxmanifest.lua'

  PerformHttpRequest(rawUrl, function(statusCode, response)
    if statusCode == 200 then
      local remoteVersion<const> = response:match('\nversion%s*["\']([^"\']+)["\']')
      if remoteVersion and remoteVersion ~= metadata.version then
        lib.print.warn(('Unmatched versions available for %s\nCurrent: %s | Latest: %s\nRepository: %s'):format(
          resourceName or metadata.repository,
          metadata.version,
          remoteVersion,
          metadata.repository
        ))
      else
        lib.print.success(('%s is up to date (v%s)'):format(resourceName or 'Resource', metadata.version))
      end
    else
      lib.print.debug(('Version check failed with status code: %s'):format(statusCode))
      lib.print.debug(('If this keeps occurring, verify the repository is public and has a valid fxmanifest.lua.\nURL: %s'):format(rawUrl))
    end
  end, 'GET')
end

local function checkAllVersion()
  local resources<const> = lib.resources()
  for i = 1, #resources do
    local resource = resources[i]
    local metadata = lib.metadata('fxmanifest.lua', {'version', 'repository'}, resource)
  
    if metadata and metadata.repository then
      checkVersion(metadata, resource)
    end
  end
end

function lib.version(resourceName, repository)
  if resourceName and repository then
    local metadata = {
      version = lib.metadata('fxmanifest.lua', {'version'}, resourceName),
      repository = repository
    }
    checkVersion(metadata, resourceName)
  end
end lib.version()

AddEventHandler('onResourceStart', function(resourceName)
  if resourceName == 'tr_lib' then
    checkAllVersion()
  end
end)