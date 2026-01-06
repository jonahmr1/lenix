import { assert } from "@trippler/tr_lib/shared"
import { isPlayerAlreadyHasJob, playerCitizenId, givePlayerRep, isPlayerLegableForHiring, addPlayerJob, playerJobRep, playerLevel, difficultyMultiplier, difficultyTiers } from "../services"
import { jobsConfig } from "../../shared/constants"
import { JobName, JobConfig } from "../../shared/types"
import { onPromise } from "@trippler/tr_lib/server"

onNet('lenix_jobcenter:takeJob', async (jobName: JobName, jobLabel: JobConfig["name"]) => {
  const src = source

  if (await isPlayerAlreadyHasJob(src, jobName)) {
    await exports.qbx_core.Notify(src, 'You already have this job')
    return
  }

  if (!isPlayerLegableForHiring(src)) {
    await exports.qbx_core.Notify(src, 'You have reached the maximum number of jobs')
    return
  }

  await addPlayerJob(await playerCitizenId(src), jobName)
  await exports.qbx_core.Notify(src, `You took the job: ${jobLabel}`, 'success')
})

onPromise('lenix_jobcenter:server:getProgress', async (source) => {
  const citizenid = await playerCitizenId(source)
  let jobsWithProgress: Record<string, any> = {}

  for (const [job, jobData] of Object.entries(jobsConfig)) {
    jobsWithProgress[job] = {}
    for (const [key, value] of Object.entries(jobData)) {
      jobsWithProgress[job][key] = value
    }
    
    const totalRep = await playerJobRep(citizenid, job as JobName)
    const currentLevel = await playerLevel(citizenid, job as JobName)
    const currentLevelXP = totalRep ? totalRep % 100 : 0
    const maxXP = jobData.maxXP

    jobsWithProgress[job].progress = {
      level: currentLevel || 0,
      currentXP: currentLevelXP,
      maxXP: maxXP,
      totalRep: totalRep
    } satisfies JobConfig["progress"]
  }
  
  assert(jobsWithProgress, 'something went wrong | server:getProgress')
  return jobsWithProgress
})

exports('givePlayerRep', givePlayerRep)
exports('getPlayerLevel', playerLevel)
exports('getPlayerDiffMultiplier', async (identifier: string, jobName: JobName) => {
  const difficultyTiersValue = difficultyTiers(await playerLevel(identifier, jobName), jobsConfig[jobName])
  if (difficultyTiersValue) return difficultyMultiplier(jobsConfig[jobName], Math.floor(difficultyTiersValue))
})