local services<const> = require 'server/services/index'

onNet('lenix_jobcenter:takeJob', function(jobName, jobLabel)
  local src<const> = source

  if services.isPlayerAlreadyHasJob(src, jobName) then
    exports.qbx_core:Notify(src, 'You already have this job', 'error')
    return
  end

  if not services.isPlayerLegableForHiring(src) then
    exports.qbx_core:Notify(src, 'You have reached the maximum number of jobs', 'error')
    return
  end

  local citizenid = services.playerCitizenId(src)
  services.addPlayerJob(citizenid, jobName)
  exports.qbx_core:Notify(src, ('You took the job: %s'):format(jobLabel), 'success')
end)

tr_lib.onPromise('lenix_jobcenter:server:getProgress', function(source)
  return services.getJobsProgress(source)
end)

-- Exports for other resources
exports('givePlayerRep', services.givePlayerRep)
exports('getPlayerLevel', services.playerLevel)
exports('getPlayerDiffMultiplier', function(identifier, jobName)
  local constants = require 'shared/constants/index'
  local level = services.playerLevel(identifier, jobName)
  local tiers = services.difficultyTiers(level, constants.jobsConfig[jobName])
  
  if tiers then
    return services.difficultyMultiplier(constants.jobsConfig[jobName], math.floor(tiers))
  end
end)