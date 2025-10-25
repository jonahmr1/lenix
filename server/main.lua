local core = exports.qbx_core
local config = require 'config.server'
local bridge = require 'bridge.server'

local function getPlayerCitizenId(source)
  return core:GetPlayer(source).PlayerData.citizenid
end

local function isPlayerOnline(identifier)
  return core:GetPlayerByCitizenId(identifier) ~= nil
end

local function getPlayerByCitizenId(citizenid)
  assert(type(citizenid) == 'string', 'citizenid must be a string')
  return core:GetPlayerByCitizenId(citizenid) or core:GetOfflinePlayer(citizenid)
end

local function getPlayerSourceByCitizenId(identifier)
  return core:GetSource(identifier)
end

local function getMetadata(citizenid)
  local metadata = getPlayerByCitizenId(citizenid).PlayerData.metadata.jobrep.police
  if not metadata then
    core:SetMetadata(citizenid, 'jobrep', { police = 0 })
    metadata = getPlayerByCitizenId(citizenid).PlayerData.metadata.jobrep.police
  end
  return metadata
end

local function setMetadata(citizenid, value)
  local metadata = getMetadata(citizenid)
  core:SetMetadata(citizenid, 'jobrep', { police = value })
  local newMetadata = getMetadata(citizenid)
  if metadata == newMetadata then
    return false, 'Metadata not updated'
  end
  return true, 'Metadata updated successfully'
end

local function hasPoliceJob(src)
  return core:HasGroup(src, 'police')
end

local function getSocietyBudget()
  return bridge.getAccountBudget()
end

lib.callback.register('tr_bossdesk:server:isPlayerBoss', function(source)
  local playerJob = core:GetPlayer(source).PlayerData.job
  local isPlayerBoss = core:IsGradeBoss(playerJob.name, playerJob.grade.level)
  return isPlayerBoss
end)

lib.callback.register('tr_bossdesk:server:getTotalPlayers', function()
  local playersdata = core:GetGroupMembers('police', 'job')
  local count = 0
  for i = 1, #playersdata do
    count = count + 1
  end
  return count
end)

lib.callback.register('tr_bossdesk:server:getJobPlayersData', function()
  local player = core:GetGroupMembers('police', 'job')
  local players = {}
  for i = 1, #player do
    local citizenid = player[i].citizenid
    local playersDataB = getPlayerByCitizenId(citizenid)
    local playerFirstName = playersDataB.PlayerData.charinfo.firstname
    local playerLastName = playersDataB.PlayerData.charinfo.lastname
    local playerGrade = playersDataB.PlayerData.job.grade.name
    players[i] = {
      id = citizenid,
      name = playerFirstName .. ' ' .. playerLastName,
      rank = playerGrade,
      badge = playersDataB.PlayerData.metadata.callsign or "NO CALLSIGN",
      status = isPlayerOnline(citizenid) and playersDataB.PlayerData.job.onduty or false
    }
  end
  return players
end)

lib.callback.register('tr_bossdesk:server:getJobBudget', function()
  return getSocietyBudget()
end)

lib.callback.register('tr_bossdesk:server:getJobOnlinePlayers', function(_, playersData)
  local onlinePlayers = 0
  for i = 1, #playersData do
    local citizenid = playersData[i].id
    if citizenid and isPlayerOnline(citizenid) then
      onlinePlayers = onlinePlayers + 1
    end
  end
  return onlinePlayers
end)

lib.callback.register('tr_bossdesk:server:hirePlayer', function(_, citizenid, grade, badge)
  if not isPlayerOnline(citizenid) then
    return false, 'Employee is not online'
  end
  if hasPoliceJob(getPlayerSourceByCitizenId(citizenid)) then
    return false, 'You cannot hire someone while already being a police officer'
  end
  core:AddPlayerToJob(citizenid, 'police', grade)
  core:SetMetadata(citizenid, 'callsign', badge)
  if hasPoliceJob(getPlayerSourceByCitizenId(citizenid)) then
    return true, 'Employee hired successfully'
  else
    return false, 'Employee not hired'
  end
end)

lib.callback.register('tr_bossdesk:server:firePlayer', function(_, citizenid, reason)
  core:RemovePlayerFromJob(citizenid, 'police')
  core:SetMetadata(citizenid, 'callsign', 'NO CALLSIGN')
  if hasPoliceJob(getPlayerSourceByCitizenId(citizenid)) then
    return false, 'Employee not fired'
  end
  lib.logger(source, 'tr_bossdesk:server:firePlayer', reason)
  return true, 'Employee fired successfully'
end)

lib.callback.register('tr_bossdesk:server:updateReputation', function(_, citizenid, action, points)
  assert(type(citizenid) == 'string' and type(action) == 'string' and type(points) == 'number', 'something went wrong in tr_bossdesk:server:updateReputation')
  local playerRep = getMetadata(citizenid)
  if action == 'commendation' then
    return setMetadata(citizenid, playerRep + points), 'Commendation added'
  else
    if action == 'warning' then
      return setMetadata(citizenid, playerRep - points), 'Warning issued'
    else
      if action == 'suspension' then
        return setMetadata(citizenid, 0), 'Employee suspended'
      else
        lib.print.error('tr_bossdesk:server:updateReputation', 'Invalid action: ' .. action)
      end
    end
  end
end)

lib.callback.register('tr_bossdesk:server:isSelfInteraction', function(_, citizenid)
  return citizenid == core:GetPlayer(source).PlayerData.citizenid
end)

lib.callback.register('tr_bossdesk:server:getJobRanks', function()
  local grades = exports.qbx_core:GetJobs().police.grades
  local gradesArray = {}
  
  local gradeLevels = {}
  for gradeLevel, _ in pairs(grades) do
    table.insert(gradeLevels, gradeLevel)
  end
  table.sort(gradeLevels)
  
  for i, gradeLevel in ipairs(gradeLevels) do
    gradesArray[i] = {
      name = grades[gradeLevel].name,
      grade = gradeLevel,
    }
  end
  return gradesArray
end)

lib.callback.register('tr_bossdesk:server:transferFunds', function(_, citizenid, reason, amount)
  if citizenid == nil or reason == nil or amount == nil then
    return false, 'Invalid parameters'
  else
    if getSocietyBudget() + config.maxBorrowAmount < amount then
      return false, 'Borrow limit exceeded'
    end
    bridge.removeMoney('police', amount, reason)
    core:AddMoney(citizenid, 'bank', amount, reason)
    return true, 'Transfer successful'
  end
end)

lib.callback.register('tr_bossdesk:server:manageFunds', function(source, action, amount, reason)
  if source == 0 or action == nil or amount == nil or reason == nil then
    return false, 'Invalid parameters'
  else
    if action == 'deposit' then
      if core:GetMoney(getPlayerCitizenId(source), 'bank') < amount then
        return false, 'Insufficient funds'
      end
      core:RemoveMoney(getPlayerCitizenId(source), 'bank', amount, reason)
      bridge.addMoney('police', amount, reason)
      return true, 'Funds deposited successfully'
    else
      if action == 'withdraw' then
        if getSocietyBudget() + config.maxBorrowAmount < amount then
          return false, 'Borrow limit exceeded'
        else
          bridge.removeMoney('police', amount, reason)
          core:AddMoney(getPlayerCitizenId(source), 'bank', amount, reason)
          return true, 'Funds withdrawn successfully'
        end
        return false, 'Invalid action'
      end
    end
  end
end)

CreateThread(function()
  exports.ox_inventory:RegisterStash(GetCurrentResourceName() .. '_managment_stash', 'Police Stash', 250, 1000 * 1000, nil, {['police'] = 0}, nil)
end)