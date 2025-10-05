local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent("tr_patrolvehicles:preview")
AddEventHandler("tr_patrolvehicles:preview", function(data)
    QBCore.Functions.TriggerCallback('tr_patrolvehicles:CheckIfActive', function(status)
        if status then
            local preview = data.preview
            local cam = data.preview.cam
            local coords = preview.coords
            InPreview = true
            QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
                FreezeEntityPosition(PlayerPedId(), true)
                SetVehicleNumberPlateText(veh, "PREVIEW")
                exports[Config.FuelSystem]:SetFuel(veh, 0.0)
                FreezeEntityPosition(veh, true)
                SetVehicleEngineOn(veh, false, false, true)
                DoScreenFadeOut(200)
                Wait(500)
                DoScreenFadeIn(200)
                SetVehicleUndriveable(veh, true)

                VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cam.coords.x, cam.coords.y, cam.coords.z, cam.rotation.verticalrotate, cam.rotation.horizontalrotate, cam.rotation.left_n_right, cam.fov, false, 0)   
                SetCamActive(VehicleCam, true)
                RenderScriptCams(true, true, 2000, true, true)
                
                CreateThread(function()
                    while true do
                        if InPreview then
                            exports['qb-core']:DrawText('⇽', 'bottom')
                        elseif not InPreview then
                            exports['qb-core']:HideText()
                            break
                        end
                        Wait(1)
                    end
                end)
        
                CreateThread(function()
                    while true do
                        if IsControlJustReleased(0, 177) then
                            FreezeEntityPosition(PlayerPedId(), false)
                            QBCore.Functions.DeleteVehicle(veh)
                            DoScreenFadeOut(200)
                            Wait(500)
                            DoScreenFadeIn(200)
                            RenderScriptCams(false, false, 1, true, true)
                            InPreview = false
                            TriggerServerEvent("tr_patrolvehicles:server:SetActive", false)
                            break
                        end
                        Wait(1)
                    end
                end)
            end, coords, true)
        end
    end)
end)