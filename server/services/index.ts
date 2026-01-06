import { assert, fatal, info } from '@trippler/tr_lib/shared'
import { JobConfig, JobName } from '../../shared/types'
import { jobsConfig } from '../../shared/constants'

const playerMetaData = async (identifier: string) => {
  const playerJobRep = await exports.qbx_core.GetMetadata(identifier, 'jobrep') as Record<string, number>
  assert(playerJobRep, `The player #${identifier} seems hasn\'t loaded`)
  return playerJobRep
}

const setPlayerJobRep = async (identifier: string, jobName: JobName, value: number) => {
  const data = await playerMetaData(identifier)
  data[jobName] = value | 0
  await exports.qbx_core.SetMetadata(identifier, 'jobrep', data)
  return (await playerMetaData(identifier))[jobName]
}

const repMultiplier = async (identifier: string, jobName: JobName, type: keyof JobConfig["repTypes"]) => {
  const jobData = jobsConfig[jobName]
  const value = jobData.repTypes[type]
  const data = Math.floor(100 / value + 0.5)
  const currentPlayerLevel = await playerLevel(identifier, jobName)
  const difficultyTiersValue = difficultyTiers(currentPlayerLevel, jobData)
  if (difficultyTiersValue) {
    const difficultyTierValue = Math.floor(difficultyTiersValue)
    const difficultyMultiplierValue = difficultyMultiplier(jobData, difficultyTierValue)
    const finalRep = Math.floor(data / difficultyMultiplierValue + 0.5)
    return finalRep
  }
}

const playerGrade = async (identifier: string, jobName: JobName) => {
  const level = await playerLevel(identifier, jobName);
  const job = jobsConfig[jobName];

  assert(job && typeof job.repGrades === 'object', 'something went wrong | playerGrade()');

  let grade = 0;
      
  for (const [requiredGrade, requiredLevel] of Object.entries(job.repGrades)) {
    const gradeNum = Number(requiredGrade)
    if (level && level >= requiredLevel && gradeNum > grade) {
      grade = gradeNum
    }
  }

  return grade
}

const updatePlayerMetaData = async (source: number, identifier: string, jobName: JobName, value: number) => {
  const levelBefore = await playerLevel(identifier, jobName)
  const gradeBefore = await playerGrade(identifier, jobName)

  const levelAfter = await playerLevel(identifier, jobName)
  const gradeAfter = await playerGrade(identifier, jobName)

  setPlayerJobRep(identifier, jobName, value)

  if (levelAfter && levelBefore && levelAfter > levelBefore) {
    PlayerLeveledUp(levelAfter)
    if (gradeAfter > gradeBefore) {
      PlayerGradedUp(gradeAfter)
      await addPlayerJob(identifier, jobName)
      exports.qbx_core.Notify(source, `You have been promoted to grade ${gradeAfter} in ${jobName}!`)
    }
  }
}

const PlayerLeveledUp = (levelAfter: number) => {
  console.log(`Level Up! Now level ${levelAfter}`)
}

const PlayerGradedUp = (gradeAfter: number) => {
  console.log(`Promoted! New grade: ${gradeAfter}`)
}

export const playerJobRep = async (identifier: string, jobName: JobName) => {
  assert(typeof identifier === 'string' && typeof jobName === 'string', 'something went wrong | playerJobRep()')
  if (!identifier) {
    fatal(`Invalid identifier in playerJobRep(${identifier}, ${jobName})`)
    return null
  }

  let attempts = 1
  while (true) {
    const metaData = await playerMetaData(identifier)
    if (!metaData || typeof metaData !== 'object') {
      fatal(`Missing or invalid metadata for identifier ${identifier} in playerJobRep(${identifier}, ${jobName})`)
    }

    const rep = metaData[jobName]
    if (!rep) {
      if (attempts <= 3) {
        info(`Job '${jobName}' not found in metadata for identifier ${identifier}, attempt ${attempts}/3 retrying...`)
        setPlayerJobRep(identifier, jobName, 0)
        await new Promise(resolve => setTimeout(resolve, 800))
        attempts++
        continue
      } else {
        fatal(`Failed to retrieve the job metadata for identifier ${identifier} in playerJobRep(${identifier}, ${jobName}) after 3 attempts`)
      }
    } else return rep
  }
}

export const playerLevel = async (identifier: string, jobName: JobName) => {
  assert(identifier && jobName, "something went wrong | playerLevel()")
  const playerJobRepValue = await playerJobRep(identifier, jobName)
  if (playerJobRepValue) return Math.ceil(playerJobRepValue / 100)
}

export const difficultyMultiplier = (jobData: JobConfig, difficultyTiers: number) => {
  return jobData.repMultiplier ^ difficultyTiers
}

export const difficultyTiers = (currentPlayerLevel: number | undefined, jobData: JobConfig) => {
  if (currentPlayerLevel) return Math.floor(currentPlayerLevel / jobData.difficultyMultiplierThresHold)
}

export const addPlayerJob = async (identifier: string, jobName: JobName) => {
  const grade = await playerGrade(identifier, jobName)
  await exports.qbx_core.AddPlayerToJob(identifier, jobName, grade)
  await exports.qbx_core.UpdatePlayerData(identifier)
}

export const playerCitizenId = async (source: number) => {
  const playerData = await exports.qbx_core.GetPlayersData()[source]
  assert(playerData, `The player #${source} seems hasn\'t loaded yet`)
  return playerData.citizenid
}

export const isPlayerAlreadyHasJob = async (source: number, jobName: JobName) => {
  const player = await exports.qbx_core.GetPlayer(source)
  if (!player) return false

  const playerJobs = player.PlayerData.jobs
  if (!playerJobs) return false

  return playerJobs[jobName] !== undefined
}

export const isPlayerLegableForHiring = async (source: number) => {
  const player = await exports.qbx_core.GetPlayer(source)
  if (!player) return false

  const playerData = player.PlayerData
  if (!playerData || !playerData.jobs) return false

  const maxJobs = GetConvarInt('qbx:max_jobs_per_player', 0)
  if (maxJobs <= 0) return true

  let currentJobs = 0
  for (const [_jobName, _grade] of Object.entries(playerData.jobs)) {
    currentJobs = currentJobs + 1
  }

  return currentJobs < maxJobs
}

export const givePlayerRep = async (source: number, identifier: string, jobName: JobName, type: keyof JobConfig["repTypes"]) => {
  const playerJobRepValue = await playerJobRep(identifier, jobName)
  const repMultiplierValue = await repMultiplier(identifier, jobName, type)
  if (!playerJobRepValue || !repMultiplierValue) return
  const value = playerJobRepValue + repMultiplierValue
  await updatePlayerMetaData(source, identifier, jobName, value)
}