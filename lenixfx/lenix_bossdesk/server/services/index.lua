local config<const> = require 'shared/constants/index'

local bridge<const> = {
  removeMoney = function(target, amount, reason) 
    return exports['Renewed-Banking']:removeAccountMoney(target, amount) 
  end,
  getAccountBudget = function(society) 
    return exports['Renewed-Banking']:getAccountMoney(society) 
  end,
  addMoney = function(target, amount, reason) 
    return exports['Renewed-Banking']:addAccountMoney(target, amount) 
  end,
}

local core<const> = {
  getGroupMembers = function(jobName, jobType) 
    return exports.qbx_core:GetGroupMembers(jobName, jobType) 
  end,
  getPlayer = function(source) 
    return exports.qbx_core:GetPlayer(source) 
  end,
  isGradeBoss = function(jobName, jobGrade) 
    return exports.qbx_core:IsGradeBoss(jobName, jobGrade) 
  end,
  getPlayerByCitizenId = function(citizenid)
    local getPlayerByCitizenId = exports.qbx_core:GetPlayerByCitizenId(citizenid)
    if getPlayerByCitizenId then return getPlayerByCitizenId end
    return exports.qbx_core:GetOfflinePlayer(citizenid)
  end,
  getPlayerSourceByCitizenId = function(citizenId) 
    return exports.qbx_core:GetSource(citizenId) 
  end,
  hasPoliceJob = function(source, jobName) 
    return exports.qbx_core:HasGroup(source, jobName) 
  end,
  addPlayerToJob = function(citizenid, jobName, grade) 
    return exports.qbx_core:AddPlayerToJob(citizenid, jobName, grade) 
  end,
  removePlayerFromJob = function(citizenid, jobName) 
    return exports.qbx_core:RemovePlayerFromJob(citizenid, jobName) 
  end,
  getJobs = function() 
    return exports.qbx_core:GetJobs() 
  end,
  addMoney = function(citizenid, account, amount, reason) 
    return exports.qbx_core:AddMoney(citizenid, account, amount, reason) 
  end,
  removeMoney = function(citizenid, account, amount, reason) 
    return exports.qbx_core:RemoveMoney(citizenid, account, amount, reason) 
  end,
  getMoney = function(citizenid, account) 
    return exports.qbx_core:GetMoney(citizenid, account) 
  end,
}

local function setCallsign(citizenid, callsign) 
  return exports.qbx_core:SetMetadata(citizenid, 'callsign', callsign) 
end

local function getPlayerCitizenId(source) 
  return core.getPlayer(source).PlayerData.citizenid 
end

local function getMetadata(citizenid)
  local player = core.getPlayerByCitizenId(citizenid)
  local metadata = player.PlayerData.metadata.jobrep.police
  if not metadata then
    exports.qbx_core:SetMetadata(citizenid, 'jobrep', { police = 0 })
    metadata = 0
  end
  return metadata
end

local function setJobRep(citizenid, value)
  local metadata = getMetadata(citizenid)
  exports.qbx_core:SetMetadata(citizenid, 'jobrep', { police = value })
  local newMetadata = getMetadata(citizenid)
  if metadata == newMetadata then
    return false, 'Metadata not updated'
  end
  return true, ''
end

local function isPlayerOnline(citizenId) 
  return exports.qbx_core:GetPlayerByCitizenId(citizenId) ~= nil 
end

local function getSocietyBudget() 
  return bridge.getAccountBudget('police') 
end

local function isPlayerBoss(source)
  local playerJob = core.getPlayer(source).PlayerData.job
  return core.isGradeBoss(playerJob.name, playerJob.grade.level)
end

local function getTotalPlayers()
  local playersdata = core.getGroupMembers('police', 'job')
  return #playersdata
end

local function getJobPlayersData()
  local playerList = core.getGroupMembers('police', 'job')
  local players = {}
  for i = 1, #playerList do
    local citizenid = playerList[i].citizenid
    local pData = core.getPlayerByCitizenId(citizenid)
    players[i] = {
      citizenid = citizenid,
      name = pData.PlayerData.charinfo.firstname .. ' ' .. pData.PlayerData.charinfo.lastname,
      rank = pData.PlayerData.job.grade.name,
      callsign = pData.PlayerData.metadata.callsign or "NO CALLSIGN",
      status = isPlayerOnline(citizenid) and pData.PlayerData.job.onduty or false
    }
  end
  return players
end

local function getJobOnlinePlayers()
  local onlinePlayers = 0
  local playersData = getJobPlayersData()
  for i = 1, #playersData do
    if isPlayerOnline(playersData[i].citizenid) then
      onlinePlayers = onlinePlayers + 1
    end
  end
  return onlinePlayers
end

local function hirePlayer(source, citizenid, grade, callsign)
  if not isPlayerOnline(citizenid) then
    return {false, 'Employee is not online'}
  end
  local targetSource = core.getPlayerSourceByCitizenId(citizenid)
  if core.hasPoliceJob(targetSource, 'police') then
    return {false, 'You cannot hire someone while already being a police officer'}
  end
  core.addPlayerToJob(citizenid, 'police', grade)
  setCallsign(citizenid, callsign)
  if core.hasPoliceJob(targetSource, 'police') then
    return {true, 'Employee hired successfully'}
  end
  return {false, 'Employee was not hired'}
end

local function firePlayer(source, citizenid, reason)
  core.removePlayerFromJob(citizenid, 'police')
  setCallsign(citizenid, 'NO CALLSIGN')
  local targetSource = core.getPlayerSourceByCitizenId(citizenid)
  if core.hasPoliceJob(targetSource, 'police') then
    return {false, 'Employee was not fired'}
  end
  return {true, 'Employee fired successfully'}
end

local function updateReputation(source, citizenid, action, points)
  local playerRep = getMetadata(citizenid)
  if action == 'commendation' then
    local success, message = setJobRep(citizenid, playerRep + points)
    return success and {true, 'Commendation added'} or {false, message}
  elseif action == 'warning' then
    local success, message = setJobRep(citizenid, playerRep - points)
    return success and {true, 'Warning issued'} or {false, message}
  elseif action == 'suspension' then
    local success, message = setJobRep(citizenid, 0)
    return success and {true, 'Employee suspended'} or {false, message}
  end
  return {false, 'Invalid action: ' .. tostring(action)}
end

local function isSelfInteraction(source, citizenid) 
  return citizenid == getPlayerCitizenId(source) 
end

local function getJobRanks()
  local grades = core.getJobs().police.grades
  local gradesArray = {}
  local gradeLevels = {}
  
  for level, _ in pairs(grades) do
    table.insert(gradeLevels, tonumber(level))
  end
  table.sort(gradeLevels)
  
  for i = 1, #gradeLevels do
    local level = tostring(gradeLevels[i])
    gradesArray[i] = {
      name = grades[level].name,
      grade = gradeLevels[i],
    }
  end
  return gradesArray
end

local function transferFunds(source, citizenid, reason, amount)
  if not citizenid or not reason or not amount then
    return {false, 'Invalid parameters'}
  end
  if getSocietyBudget() + config.maxBorrowAmount < amount then
    return {false, 'Borrow limit exceeded'}
  end
  bridge.removeMoney('police', amount, reason)
  core.addMoney(citizenid, 'bank', amount, reason)
  return {true, 'Transfer successful'}
end

local function manageFunds(source, action, amount, reason)
  if source == 0 or not action or not amount or not reason then
    return {false, 'Invalid parameters'}
  end
  if action == 'deposit' then
    if core.getMoney(getPlayerCitizenId(source), 'bank') < amount then
      return {false, 'Insufficient funds'}
    end
    core.removeMoney(getPlayerCitizenId(source), 'bank', amount, reason)
    bridge.addMoney('police', amount, reason)
    return {true, 'Funds deposited successfully'}
  elseif action == 'withdraw' then
    if getSocietyBudget() + config.maxBorrowAmount < amount then
      return {false, 'Borrow limit exceeded'}
    else
      bridge.removeMoney('police', amount, reason)
      core.addMoney(getPlayerCitizenId(source), 'bank', amount, reason)
      return {true, 'Funds withdrawn successfully'}
    end
  end
  return {false, 'Invalid action'}
end

return {
  getSocietyBudget = getSocietyBudget,
  isPlayerBoss = isPlayerBoss,
  getTotalPlayers = getTotalPlayers,
  getJobPlayersData = getJobPlayersData,
  getJobOnlinePlayers = getJobOnlinePlayers,
  hirePlayer = hirePlayer,
  firePlayer = firePlayer,
  updateReputation = updateReputation,
  isSelfInteraction = isSelfInteraction,
  getJobRanks = getJobRanks,
  transferFunds = transferFunds,
  manageFunds = manageFunds
}