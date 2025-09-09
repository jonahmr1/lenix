local export = exports.qbx_core
local Jobs = require 'config.shared'
local UIConfig = require 'config.client'.ui
local ThemeConfig = require 'config.client'.theme
local Notifications = require 'config.client'.notifications

local function ShowNotification(message)
    export:Notify(message)
end

-- Open/close UI
local function OpenJobCenter()
    local jobsProgress = lib.callback.await('tr_jobcenter:server:getProgress', GetPlayerServerId(PlayerPedId()))
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

local function CloseJobCenter()
    SendNUIMessage({ action = 'closeJobCenter' })
    SetNuiFocus(false, false)
    TriggerScreenblurFadeOut(4000)
end

-- NUI callbacks
RegisterNUICallback('closeUI', function(_, cb) CloseJobCenter(); cb('ok') end)

RegisterNUICallback('takeJob', function(data, cb)
    if not Jobs[data.job] then cb(false) return end

    TriggerServerEvent('tr_jobcenter:takeJob', data.job, data.label)
    CloseJobCenter()
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

-- Exports
exports('OpenJobCenter', OpenJobCenter)
exports('CloseJobCenter', CloseJobCenter)