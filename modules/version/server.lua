local checkReleaseVersionInstead<const> = lib.load('config', GetCurrentResourceName()).checkReleaseVersionInstead
local excludedFromVersion<const> = lib.load('config', GetCurrentResourceName()).excludedFromVersion
lib.version = {}

local function parseGithubRepo(repository)
  local cleanPath = lib.filter(repository, 'https://', 'http://', 'github.com/', '%.git$')
  local owner, repoName = cleanPath:match('^([^/]+)/([^/]+)')
  
  return owner, repoName
end

local function isRepoArchived(owner, repoName, callback)
  local apiUrl<const> = ('https://api.github.com/repos/%s/%s'):format(owner, repoName)
  
  PerformHttpRequest(apiUrl, function(statusCode, response)
    if statusCode == 200 then
      local success<const>, data<const> = pcall(json.decode, response)
      
      if success and data and data.archived then
        callback(true)
      else
        callback(false)
      end
    else
      -- If we can't check, assume it's not archived to continue with version check, cause some time we just get a rate limit from github api (60 per hour I guess)
      callback(false)
    end
  end, 'GET', '', {['Content-Type'] = 'application/json'})
end

local function checkSourceVersion(metadata, resourceName)
  assert(metadata.repository, 'No repository provided')
  
  local owner<const>, repoName = parseGithubRepo(metadata.repository)
  
  if not owner or not repoName then
    lib.print.warn('Invalid GitHub repository URL')
    return nil
  end
  
  isRepoArchived(owner, repoName, function(archived)
    if archived then return nil end
    
    local rawUrl<const> = ('https://raw.githubusercontent.com/%s/%s/refs/heads/main/fxmanifest.lua'):format(owner, repoName)
    
    PerformHttpRequest(rawUrl, function(statusCode, response)
      if statusCode == 200 then
        local remoteVersion<const> = response:match('\nversion%s*["\']([^"\']+)["\']')
        
        if remoteVersion and remoteVersion ~= metadata.version then
          lib.print.warn(('Unmatched versions available for the resource %s\nCurrent: %s | Latest: %s\nRepository: %s'):format(
            resourceName or metadata.repository,
            metadata.version,
            remoteVersion,
            metadata.repository
          ))
          return false, remoteVersion
        else
          lib.print.success(('%s is up to date (v%s)'):format(resourceName or 'Resource', metadata.version))
          return true, metadata.version
        end
      else
        lib.print.debug(('Source version check failed with status code: %s for %s'):format(statusCode, resourceName))
        return nil
      end
    end, 'GET')
  end)
end

local function checkReleaseVersion(metadata, resourceName)
  assert(metadata.repository, 'No repository provided')
  
  local owner<const>, repoName = parseGithubRepo(metadata.repository)
  
  if not owner or not repoName then
    lib.print.warn('Invalid GitHub repository URL')
    return nil
  end
  
  isRepoArchived(owner, repoName, function(archived)
    if archived then return nil end
    
    local apiUrl<const> = ('https://api.github.com/repos/%s/%s/releases/latest'):format(owner, repoName)
    
    PerformHttpRequest(apiUrl, function(statusCode, response)
      if statusCode == 200 then
        local success<const>, data<const> = pcall(json.decode, response)
        
        if not success then
          lib.print.debug('Failed to decode GitHub API response')
          return nil
        end
        
        if not data or not data.tag_name then return nil end
        
        local remoteVersion<const> = data.tag_name:gsub('^v', '')
        local currentVersion<const> = metadata.version:gsub('^v', '')
        
        if remoteVersion ~= currentVersion then
          lib.print.warn(('New release available for the resource %s\nCurrent: %s | Latest: %s\nDownload: %s'):format(
            resourceName or metadata.repository,
            currentVersion,
            remoteVersion,
            ('https://github.com/%s/%s/releases/latest'):format(owner, repoName)
          ))
          return false, remoteVersion
        else
          lib.print.success(('%s is up to date (v%s)'):format(resourceName or 'Resource', currentVersion))
          return true, currentVersion
        end
      else
        lib.print.debug(('Release version check failed with status code: %s for %s'):format(statusCode, resourceName))
        return nil
      end
    end, 'GET', '', {['Content-Type'] = 'application/json'})
  end)
end

function lib.version.source(repository, resourceName)
  assert(repository, 'No repository provided')
  
  local metadata<const> = {
    version = lib.metadata('version'),
    repository = repository
  }
  
  checkSourceVersion(metadata, resourceName)
end

function lib.version.release(repository, resourceName)
  assert(repository, 'No repository provided')
  
  local metadata<const> = {
    version = lib.metadata('version'),
    repository = repository
  }
  
  checkReleaseVersion(metadata, resourceName)
end

AddEventHandler('onResourceStart', function(resourceName)
  if resourceName == 'tr_lib' then
    local resources<const> = lib.resources(excludedFromVersion)
    for i = 1, #resources do
      local resource<const> = resources[i]
      local metadata<const> = lib.metadata({'version', 'repository'}, resource)
      
      if metadata and metadata.repository then
        if checkReleaseVersionInstead then
          checkReleaseVersion(metadata, resource)
        else
          checkSourceVersion(metadata, resource)
        end
      end
    end
  end
end)