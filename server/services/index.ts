import { assert } from '@trippler/tr_lib/shared'  
import { config } from '../../shared/constants'

interface PlayerData {
  charinfo: {
    firstname: string
    lastname: string
  }
  job: {
    grade: {
      name: string
      level: number
    }
    name: string
    onduty: boolean
  },
  metadata: {
    callsign: string
    jobrep: Record<string, number>
  }
  citizenid: string
}

interface JobData {
  [jobName: string]: {
    grades: {
      name: string
    }[]
  }
}

const bridge = {
  removeMoney: (target: number | string, amount: number, reason: string) => exports['Renewed-Banking'].removeAccountMoney(target, amount),
  getAccountBudget: (society: string): number => exports['Renewed-Banking'].getAccountMoney(society),
  addMoney: (target: number | string, amount: number, reason: string) => exports['Renewed-Banking'].addAccountMoney(target, amount),
}

const core = {
  getGroupMembers: (jobName: string, jobType: string): {
    citizenid: string,
  }[] => exports.qbx_core.GetGroupMembers(jobName, jobType),
  getPlayer: (source: number): {
    PlayerData: PlayerData
  } => exports.qbx_core.GetPlayer(source),
  isGradeBoss: (jobName: string, jobGrade: number): boolean => exports.qbx_core.IsGradeBoss(jobName, jobGrade),
  getPlayerByCitizenId: (citizenid: string): { PlayerData: PlayerData } => {
    assert(typeof citizenid === 'string', 'citizenid must be a string')
    const getPlayerByCitizenId = exports.qbx_core.GetPlayerByCitizenId(citizenid)
    if (getPlayerByCitizenId) return getPlayerByCitizenId
    const getOfflinePlayer = exports.qbx_core.GetOfflinePlayer(citizenid)
    return getOfflinePlayer
  },
  getPlayerSourceByCitizenId: (ctitizenId: string): number => exports.qbx_core.GetSource(ctitizenId),
  hasPoliceJob: (source: number, jobName: string): boolean => exports.qbx_core.HasGroup(source, jobName),
  addPlayerToJob: (citizenid: string, jobName: string, grade: number): unknown => exports.qbx_core.AddPlayerToJob(citizenid, jobName, grade),
  removePlayerFromJob: (citizenid: string, jobName: string): unknown => exports.qbx_core.RemovePlayerFromJob(citizenid, jobName),
  getJobs: (): JobData => exports.qbx_core.GetJobs(),
  addMoney: (citizenid: string, account: string, amount: number, reason: string): unknown => exports.qbx_core.AddMoney(citizenid, account, amount, reason),
  removeMoney: (citizenid: string, account: string, amount: number, reason: string): unknown => exports.qbx_core.RemoveMoney(citizenid, account, amount, reason),
  getMoney: (citizenid: string, account: string) => exports.qbx_core.GetMoney(citizenid, account),
}

const setCallsign = (citizenid: string, callsign: string): unknown => exports.qbx_core.SetMetadata(citizenid, 'callsign', callsign)
const getPlayerCitizenId = (source: number) => core.getPlayer(source).PlayerData.citizenid

const getMetadata = (citizenid: string) => {
  let metadata = core.getPlayerByCitizenId(citizenid).PlayerData.metadata.jobrep.police
  if (!metadata) {
    exports.qbx_core.SetMetadata(citizenid, 'jobrep', { police: 0 })
    metadata = core.getPlayerByCitizenId(citizenid).PlayerData.metadata.jobrep.police
  }
  return metadata
}

const setJobRep = (citizenid: string, value: number): [boolean, string] => {
  let metadata = getMetadata(citizenid)
  exports.qbx_core.SetMetadata(citizenid, 'jobrep', { police: value })
  let newMetadata = getMetadata(citizenid)
  if (metadata == newMetadata) {
    return [false, 'Metadata not updated']
  }
  return [true, '']
}

const isPlayerOnline = (citizenId: string) => exports.qbx_core.GetPlayerByCitizenId(citizenId) != null

export const getSocietyBudget = () => bridge.getAccountBudget('police')

export const isPlayerBoss = (source: number) => {
  const playerJob = core.getPlayer(source).PlayerData.job
  const isPlayerBoss = core.isGradeBoss(playerJob.name, playerJob.grade.level)
  return isPlayerBoss
}

export const getTotalPlayers = async () => {
  const playersdata = core.getGroupMembers('police', 'job')
  let count = 0
  for (let i = 1; i <= playersdata.length; i++) {
    count++
  }
  return count
}

export const getJobPlayersData = async () => {
  const player = core.getGroupMembers('police', 'job')
  const players = []
  for (let i = 1; i <= player.length; i++) {
    const citizenid = player[i].citizenid
    const playersDataB = core.getPlayerByCitizenId(citizenid)
    const playerFirstName = playersDataB.PlayerData.charinfo.firstname
    const playerLastName = playersDataB.PlayerData.charinfo.lastname
    const playerGrade = playersDataB.PlayerData.job.grade.name
    players[i] = {
      citizenid,
      name: playerFirstName + ' ' + playerLastName,
      rank: playerGrade,
      callsign: playersDataB.PlayerData.metadata.callsign || "NO CALLSIGN",
      status: isPlayerOnline(citizenid) ? playersDataB.PlayerData.job.onduty : false
    }
  }
  return players
}

export const getJobOnlinePlayers = async (_source: number) => {
  let onlinePlayers = 0
  const playersData = await getJobPlayersData()
  for (let i = 1; i <= playersData.length; i++) {
    const citizenid = playersData[i].citizenid
    const isPlayerInServer = isPlayerOnline(citizenid)
    if (citizenid && isPlayerInServer) onlinePlayers = onlinePlayers + 1
  }
  return onlinePlayers
}

export const hirePlayer = async (_source: number, citizenid: string, grade: number, callsign: string): Promise<[boolean, string]> => {
  if (!isPlayerOnline(citizenid)) {
    return [false, 'Employee is not online']
  }
  const source = core.getPlayerSourceByCitizenId(citizenid)
  const playerAlreadyHasPoliceJob = core.hasPoliceJob(source, 'police')
  if (playerAlreadyHasPoliceJob) {
    return [false, 'You cannot hire someone while already being a police officer']
  }
  core.addPlayerToJob(citizenid, 'police', grade)
  setCallsign(citizenid, callsign)
  const playerHasPoliceJob = core.hasPoliceJob(source, 'police')
  if (playerHasPoliceJob) {
    return [true, 'Employee hired successfully']
  } else {
    return [false, 'Employee was not hired']
  }
}

export const firePlayer = async (_source: number, citizenid: string, reason: string): Promise<[boolean, string]> => {
  core.removePlayerFromJob(citizenid, 'police')
  setCallsign(citizenid, 'NO CALLSIGN')
  const source = core.getPlayerSourceByCitizenId(citizenid)
  const playerHasPoliceJob = core.hasPoliceJob(source, 'police')
  if (!playerHasPoliceJob) {
    return [false, 'Employee was not fired']
  }
  return [true, 'Employee fired successfully']
}

export const updateReputation = (_source: number, citizenid: string, action: string, points: number): [boolean, string] => {
  assert(typeof citizenid === 'string' && typeof action === 'string' && typeof points === 'number', 'something went wrong in lenix_bossdesk:server:updateReputation')
  const playerRep = getMetadata(citizenid)
  if (action == 'commendation') {
    const [success, message] = setJobRep(citizenid, playerRep + points)
    if (success) return [true, 'Commendation added']
    else return [false, message]
  } else if (action == 'warning') {
    const [success, message] = setJobRep(citizenid, playerRep - points)
    if (success) return [true, 'Warning issued']
    else return [false, message]
  } else if (action == 'suspension') {
    const [success, message] = setJobRep(citizenid, 0)
    if (success) return [true, 'Employee suspended']
    else return [false, message]
  } else return [false, 'Invalid action: ' + action]
}

export const isSelfInteraction = async (source: number, citizenid: string) => citizenid == core.getPlayer(source).PlayerData.citizenid

export const getJobRanks = () => {
  const grades = core.getJobs().police.grades
  const gradesArray = []
  
  const gradeLevels: number[] = []
  for (const gradeLevel in grades) {
    gradeLevels.push(Number(gradeLevel))
  }
  gradeLevels.sort()
  
  for (let i = 0; i < gradeLevels.length; i++) {
    gradesArray[i] = {
      name: grades[gradeLevels[i]].name,
      grade: gradeLevels[i],
    }
  }
  return gradesArray
}

export const transferFunds = (_source: number, citizenid: string, reason: string, amount: number): [boolean, string] => {
  if (citizenid == null || reason == null || amount == null) {
    return [false, 'Invalid parameters']
  } else if (getSocietyBudget() + config.maxBorrowAmount < amount) {
    return [false, 'Borrow limit exceeded']
  }
  bridge.removeMoney('police', amount, reason)
  core.addMoney(citizenid, 'bank', amount, reason)
  return [true, 'Transfer successful']
}

export const manageFunds = (source: number, action: string, amount: number, reason: string): [boolean, string] => {
  if (source == 0 || action == null || amount == null || reason == null) {
    return [false, 'Invalid parameters']
  } else if (action == 'deposit') {
    if (core.getMoney(getPlayerCitizenId(source), 'bank') < amount) {
      return [false, 'Insufficient funds']
    }
    core.removeMoney(getPlayerCitizenId(source), 'bank', amount, reason)
    bridge.addMoney('police', amount, reason)
    return [true, 'Funds deposited successfully']
  } else if (action == 'withdraw') {
    if (getSocietyBudget() + config.maxBorrowAmount < amount) {
      return [false, 'Borrow limit exceeded']
    } else {
      bridge.removeMoney('police', amount, reason)
      core.addMoney(getPlayerCitizenId(source), 'bank', amount, reason)
      return [true, 'Funds withdrawn successfully']
    }
  } else return [false, 'Invalid action']
}

export interface ServicesTypes {
  SocietyBudget: ReturnType<typeof getSocietyBudget>
  IsPlayerBoss: ReturnType<typeof isPlayerBoss>
  TotalPlayers: ReturnType<typeof getTotalPlayers>
  JobPlayersData: ReturnType<typeof getJobPlayersData>
  JobOnlinePlayers: ReturnType<typeof getJobOnlinePlayers>
  HirePlayer: ReturnType<typeof hirePlayer>
  FirePlayer: ReturnType<typeof firePlayer>
  UpdateReputation: ReturnType<typeof updateReputation>
  IsSelfInteraction: ReturnType<typeof isSelfInteraction>
  JobRanks: ReturnType<typeof getJobRanks>
  TransferFunds: ReturnType<typeof transferFunds>
  ManageFunds: ReturnType<typeof manageFunds>
}