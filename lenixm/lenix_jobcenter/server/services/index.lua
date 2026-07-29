local constants<const> = require 'shared/constants/index'
local services = {}

-- Utility to get Player Citizen ID
function services.playerCitizenId(source)
  local pData = exports.qbx_core:GetPlayer(source)
  if not pData then return nil end
  return pData.PlayerData.citizenid
end

local function playerMetaData(identifier)
  local rep = exports.qbx_core:GetMetadata(identifier, 'jobrep')
  return rep or {}
end

local function setPlayerJobRep(identifier, jobName, value)
  local data = playerMetaData(identifier)
  data[jobName] = math.floor(value)
  exports.qbx_core:SetMetadata(identifier, 'jobrep', data)
  return data[jobName]
end

function services.difficultyMultiplier(jobData, difficultyTiers)
  -- In Lua ^ is power, if you intended bitwise XOR, use bit32.bxor
  -- Based on TS code, this looks like a power calculation
  return math.floor(jobData.repMultiplier ^ difficultyTiers)
end

function services.difficultyTiers(currentPlayerLevel, jobData)
  if not currentPlayerLevel then return 0 end
  return math.floor(currentPlayerLevel / jobData.difficultyMultiplierThresHold)
end

function services.playerLevel(identifier, jobName)
  local rep = services.playerJobRep(identifier, jobName)
  if not rep then return 1 end
  return math.ceil(rep / 100)
end

local function playerGrade(identifier, jobName)
  local level = services.playerLevel(identifier, jobName)
  local job = constants.jobsConfig[jobName]
  local grade = 0

  if job and job.repGrades then
    for k, requiredLevel in pairs(job.repGrades) do
      local gradeNum = tonumber(k)
      if level >= requiredLevel and gradeNum > grade then
        grade = gradeNum
      end
    end
  end
  return grade
end

function services.addPlayerJob(identifier, jobName)
  local grade = playerGrade(identifier, jobName)
  exports.qbx_core:AddPlayerToJob(identifier, jobName, grade)
end

local function updatePlayerMetaData(source, identifier, jobName, value)
  local levelBefore = services.playerLevel(identifier, jobName)
  local gradeBefore = playerGrade(identifier, jobName)

  setPlayerJobRep(identifier, jobName, value)

  local levelAfter = services.playerLevel(identifier, jobName)
  local gradeAfter = playerGrade(identifier, jobName)

  if levelAfter > levelBefore then
    print(('Level Up! %s is now level %s'):format(identifier, levelAfter))
    if gradeAfter > gradeBefore then
      services.addPlayerJob(identifier, jobName)
      exports.qbx_core:Notify(source, ('Promoted to grade %s in %s!'):format(gradeAfter, jobName))
    end
  end
end

function services.playerJobRep(identifier, jobName)
  local attempts = 1
  while attempts <= 3 do
    local metaData = playerMetaData(identifier)
    local rep = metaData[jobName]

    if not rep then
      setPlayerJobRep(identifier, jobName, 0)
      Wait(800) -- Lua Wait instead of Promise resolve
      attempts = attempts + 1
    else
      return rep
    end
  end
  return 0
end

function services.isPlayerAlreadyHasJob(source, jobName)
  local player = exports.qbx_core:GetPlayer(source)
  if not player then return false end
  return player.PlayerData.jobs[jobName] ~= nil
end

function services.isPlayerLegableForHiring(source)
  local player = exports.qbx_core:GetPlayer(source)
  if not player then return false end

  local maxJobs = GetConvarInt('qbx:max_jobs_per_player', 0)
  if maxJobs <= 0 then return true end

  local currentJobs = 0
  for _ in pairs(player.PlayerData.jobs) do
    currentJobs = currentJobs + 1
  end

  return currentJobs < maxJobs
end

function services.getJobsProgress(source)
  local citizenid = services.playerCitizenId(source)
  local jobsWithProgress = {}

  for job, jobData in pairs(constants.jobsConfig) do
    local totalRep = services.playerJobRep(citizenid, job)
    local currentLevel = services.playerLevel(citizenid, job)
    
    jobsWithProgress[job] = {}
    for k, v in pairs(jobData) do jobsWithProgress[job][k] = v end

    jobsWithProgress[job].progress = {
      level = currentLevel,
      currentXP = totalRep % 100,
      maxXP = jobData.maxXP,
      totalRep = totalRep
    }
  end
  return jobsWithProgress
end

function services.givePlayerRep(source, identifier, jobName, repType)
  local jobData = constants.jobsConfig[jobName]
  if not jobData then return end

  local currentRep = services.playerJobRep(identifier, jobName)
  
  -- Calculation logic from repMultiplier
  local baseValue = jobData.repTypes[repType]
  local rawGain = math.floor(100 / baseValue + 0.5)
  
  local level = services.playerLevel(identifier, jobName)
  local tiers = services.difficultyTiers(level, jobData)
  local multiplier = services.difficultyMultiplier(jobData, math.floor(tiers))
  
  local finalGain = math.floor(rawGain / multiplier + 0.5)
  
  updatePlayerMetaData(source, identifier, jobName, currentRep + finalGain)
end

return services