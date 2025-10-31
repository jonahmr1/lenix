local Jobs = require 'config/shared'
local export = exports.qbx_core

local function playerCitizenId(source)
    return export:GetPlayersData()[source].citizenid
end

local function playerMetaData(identifier)
    return export:GetMetadata(identifier, 'jobrep')
end

local function setPlayerJobRep(identifier, jobName, value)
    local data = playerMetaData(identifier)
    data[jobName] = value or 0
    export:SetMetadata(identifier, 'jobrep', data)
    return playerMetaData(identifier)[jobName]
end

local function playerJobRep(identifier, jobName)
    assert(type(identifier) == 'string' and type(jobName) == 'string', 'something went wrong | playerJobRep()')
    if not identifier then
        lib.print.error(("Invalid identifier in playerJobRep(%s, %s)"):format(tostring(identifier), tostring(jobName)))
        return nil
    end

    :: retry ::

    local metaData = playerMetaData(identifier)
    if not metaData or type(metaData) ~= "table" then
        lib.print.error(("Missing or invalid metadata for identifier %s in playerJobRep(%s)"):format(identifier, jobName))
        return nil
    end

    local rep = metaData[jobName]
    if rep == nil then
        lib.print.error(("Job '%s' not found in metadata for identifier %s, retrying..."):format(jobName, identifier))
        setPlayerJobRep(identifier, jobName, 0)
        Wait(800)
        goto retry
        return nil
    end

    return rep
end

local function playerLevel(identifier, jobName)
    assert(identifier, "something went wrong | playerLevel()")
    return math.ceil(playerJobRep(identifier, jobName) / 100)
end

local function difficultyMultiplier(jobData, difficultyTiers)
    return jobData.repMultiplier ^ difficultyTiers
end

local function difficultyTiers(currentPlayerLevel, jobData)
    return currentPlayerLevel / jobData.difficultyMultiplierThresHold
end

local function repMultiplier(identifier, jobName, type)
    local jobData = Jobs[jobName]
    local value = jobData.repTypes[type]
    local data = math.floor(100 / value + 0.5)
    local currentPlayerLevel = playerLevel(identifier, jobName)
    local difficultyTiers = math.floor(difficultyTiers(currentPlayerLevel, jobData))
    local difficultyMultiplier = difficultyMultiplier(jobData, difficultyTiers)
    local finalRep = math.floor(data / difficultyMultiplier + 0.5)
    return finalRep
end

local function playerGrade(identifier, jobName)
    local lvl = playerLevel(identifier, jobName)
    local job = Jobs[jobName]

    assert(job and type(job.repGrades) == 'table', 'something went wrong | playerGrade()')

    local grade = 0
    for g, requiredLevel in pairs(job.repGrades) do
        if lvl >= requiredLevel and g > grade then
            grade = g
        end
    end

    return grade
end

local function addPlayerJob(identifier, jobName)
    local grade = playerGrade(identifier, jobName)
    export:AddPlayerToJob(identifier, jobName, grade)
    export:UpdatePlayerData(identifier)
end

local function isPlayerAlreadyHasJob(source, jobName)
    local player = export:GetPlayer(source)
    if not player then return false end

    local playerJobs = player.PlayerData.jobs
    if not playerJobs then return false end

    return playerJobs[jobName] ~= nil
end

local function isPlayerLegableForHiring(source)
    local player = export:GetPlayer(source)
    if not player then return false end

    local playerData = player.PlayerData
    if not playerData or not playerData.jobs then return false end

    local maxJobs = GetConvarInt('qbx:max_jobs_per_player', 0)
    if maxJobs <= 0 then return true end

    local currentJobs = 0
    for jobName, grade in pairs(playerData.jobs) do
        currentJobs = currentJobs + 1
    end

    return currentJobs < maxJobs
end

local function givePlayerRep(source, identifier, jobName, type)
    local value = playerJobRep(identifier, jobName) + repMultiplier(identifier, jobName, type)
    updatePlayerMetaData(source, identifier, jobName, value)
end

function updatePlayerMetaData(source, identifier, jobName, value)
    local levelBefore = playerLevel(identifier, jobName)
    local gradeBefore = playerGrade(identifier, jobName)

    local levelAfter = playerLevel(identifier, jobName)
    local gradeAfter = playerGrade(identifier, jobName)

    setPlayerJobRep(identifier, jobName, value)

    if levelAfter > levelBefore then
        PlayerLeveledUp(levelAfter)
        if gradeAfter > gradeBefore then
            PlayerGradedUp(gradeAfter)
            addPlayerJob(identifier, jobName)
            export:Notify(source, ('You have been promoted to grade %d in %s!'):format(gradeAfter, jobName))
        end
    end
end

RegisterNetEvent('tr_jobcenter:takeJob', function(jobName, jobLabel)
    local src = source

    if isPlayerAlreadyHasJob(src, jobName) then
        export:Notify(src, 'You already have this job')
        return
    end

    if not isPlayerLegableForHiring(src) then
        export:Notify(src, 'You have reached the maximum number of jobs')
        return
    end

    addPlayerJob(playerCitizenId(src), jobName)
    export:Notify(src, ('You took the job: %s'):format(jobLabel), 'success')
end)

lib.callback.register('tr_jobcenter:server:getProgress', function(source)
    local citizenid = playerCitizenId(source)
    local jobsWithProgress = {}

    for job, jobData in pairs(Jobs) do
        jobsWithProgress[job] = {}
        for key, value in pairs(jobData) do
            jobsWithProgress[job][key] = value
        end

        local totalRep = playerJobRep(citizenid, job)
        local currentLevel = playerLevel(citizenid, job)
        local currentLevelXP = totalRep % 100
        local maxXP = jobData.maxXP

        jobsWithProgress[job].progress = {
            level = currentLevel,
            currentXP = currentLevelXP,
            maxXP = maxXP,
            totalRep = totalRep
        }
    end
    assert(jobsWithProgress ~= nil, 'something went wrong | server:getProgress')
    print(jobsWithProgress)
    return jobsWithProgress
end)

exports('givePlayerRep', givePlayerRep)
exports('getPlayerLevel', playerLevel)
exports('getPlayerDiffMultiplier', function(identifier, jobName)
    return difficultyMultiplier(Jobs[jobName],
        math.floor(difficultyTiers(playerLevel(identifier, jobName), Jobs[jobName])))
end)