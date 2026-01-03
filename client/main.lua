local export = exports.qbx_core
local Jobs = require 'config/shared'
local UIConfig = require 'config/client'.ui
local ThemeConfig = require 'config/client'.theme

local function ShowNotification(message)
    export:Notify(message)
end

local function openJobCenter()
    local jobsProgress = lib.callback.await('lenix_jobcenter:server:getProgress')
    SendNUIMessage({
        action = 'openJobCenter',
        jobs = jobsProgress,
        config = {
            UI = UIConfig,
            Theme = ThemeConfig,
        }
    })
    SetNuiFocus(true, true)
    TriggerScreenblurFadeIn(4000)
end

local function closeJobCenter()
    SendNUIMessage({ action = 'closeJobCenter' })
    SetNuiFocus(false, false)
    TriggerScreenblurFadeOut(4000)
end

RegisterNUICallback('closeUI', function(_, cb) closeJobCenter(); cb('ok') end)

RegisterNUICallback('takeJob', function(data, cb)
    if not Jobs[data.job] then cb(false) return end

    TriggerServerEvent('lenix_jobcenter:takeJob', data.job, data.label)
    closeJobCenter()
    cb('ok')
end)

RegisterNUICallback('markLocation', function(data, cb)
    local job = Jobs[data.job]
    if job and job.location then
        SetNewWaypoint(job.location.x, job.location.y)
        ShowNotification(('Location marked for %s'):format(job.name))
        cb(true)
    else
        cb(false)
    end
end)

exports('openJobCenter', openJobCenter)
exports('closeJobCenter', closeJobCenter)