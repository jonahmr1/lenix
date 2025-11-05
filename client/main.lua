local isActive = false
PlayerJob = {}

RegisterNetEvent('QBCore:Client:OnPlayerLoaded')
AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    QBCore.Functions.GetPlayerData(function(PlayerData)
        PlayerJob = PlayerData.job
    end)
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate')
AddEventHandler('QBCore:Client:OnJobUpdate', function(JobInfo)
    PlayerJob = JobInfo
end)

AddEventHandler('onClientResourceStart',function()
    Citizen.CreateThread(function()
        while true do
            if QBCore ~= nil and QBCore.Functions.GetPlayerData ~= nil then
                QBCore.Functions.GetPlayerData(function(PlayerData)
                    if PlayerData.job then
                        PlayerJob = PlayerData.job
                    end
                end)
                break
            end
        end
        Citizen.Wait(1)
    end)
end)

RegisterNetEvent('lenix_patrolvehicles:client:SetActive', function(status)
    isActive = status
end)

function DrawText3D(x, y, z, text)
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x,y,z, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 370
    DrawRect(0.0, 0.0+0.0125, 0.017+ factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end

function ShowHelpNotification(text)
    SetTextComponentFormat("STRING")
    AddTextComponentString(text)
    DisplayHelpTextFromStringLabel(0, 0, 1, -1)
end

RegisterCommand('getpatrolscfg', function()
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    local modType = 48 -- Example: 0 for spoilers
    if vehicle ~= 0 then
        local mod = GetVehicleLivery(vehicle)
        print('Vehicle Livery:', mod)
        print('Vehicle Mod:', GetVehicleMod(vehicle, modType))
    end
end, false)