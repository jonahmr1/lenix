local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent("patrols:PreviewVehicle")
AddEventHandler("patrols:PreviewVehicle", function(data)
    if Config.UsePreviewMenuSync then
        QBCore.Functions.TriggerCallback('patrols:CheckIfActive', function(result)
            if result then
                InPreview = true
                local coords = vector4(458.73, -993.54, 24.97, 4.34)
                QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
                    SetEntityVisible(PlayerPedId(), false, 1)
                    if Config.SetVehicleTransparency == 'low' then
                        SetEntityAlpha(veh, 400)
                    elseif Config.SetVehicleTransparency == 'medium' then
                        SetEntityAlpha(veh, 93)
                    elseif Config.SetVehicleTransparency == 'high' then
                        SetEntityAlpha(veh, 40)
                    elseif Config.SetVehicleTransparency == 'none' then
                        
                    end
                    FreezeEntityPosition(PlayerPedId(), true)
                    SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
                    exports[Config.FuelSystem]:SetFuel(veh, 0.0)
                    CloseMenu()
                    FreezeEntityPosition(veh, true)
                    SetVehicleEngineOn(veh, false, false)
                    DoScreenFadeOut(200)
                    Citizen.Wait(500)
                    DoScreenFadeIn(200)
                    SetVehicleUndriveable(veh, true)
                
                    VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 455.64, -990.14, 25.85, 221.37, 50, 0.00, 1.84, 100.00, false, 0)   
                    SetCamActive(VehicleCam, true)
                    RenderScriptCams(true, true, 500, true, true)
                    
                    if Config.MS == 'high' then
                        Citizen.CreateThread(function()
                            while true do
                                if InPreview then
                                    ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                                elseif not InPreview then
                                    break
                                end
                                Citizen.Wait(1)
                            end
                        end)
                    elseif Config.MS == 'low' then
                        ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                    end
            
                    Citizen.CreateThread(function()
                        while true do
                            if IsControlJustReleased(0, 177) then
                                SetEntityVisible(PlayerPedId(), true, 1)
                                FreezeEntityPosition(PlayerPedId(), false)
                                PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                                QBCore.Functions.DeleteVehicle(veh)
                                DoScreenFadeOut(200)
                                Citizen.Wait(500)
                                DoScreenFadeIn(200)
                                RenderScriptCams(false, false, 1, true, true)
                                InPreview = false
                                TriggerServerEvent("patrols:server:SetActive", false)
                                break
                            end
                            Citizen.Wait(1)
                        end
                    end)
                end, coords, true)
            end
        end)
    else
        InPreview = true
        local coords = vector4(458.73, -993.54, 24.97, 4.34) 
        QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
            SetEntityVisible(PlayerPedId(), false, 1)
            if Config.SetVehicleTransparency == 'low' then
                SetEntityAlpha(veh, 400)
            elseif Config.SetVehicleTransparency == 'medium' then
                SetEntityAlpha(veh, 93)
            elseif Config.SetVehicleTransparency == 'high' then
                SetEntityAlpha(veh, 40)
            elseif Config.SetVehicleTransparency == 'none' then
                
            end
            FreezeEntityPosition(PlayerPedId(), true)
            SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
            exports[Config.FuelSystem]:SetFuel(veh, 0.0)
            CloseMenu()
            FreezeEntityPosition(veh, true)
            SetVehicleEngineOn(veh, false, false)
            DoScreenFadeOut(200)
            Citizen.Wait(500)
            DoScreenFadeIn(200)
            SetVehicleUndriveable(veh, true)

            VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 455.64, -988.14, 26.35, -10.0, 0.00, -145.0, 40.00, false, 0)   
            SetCamActive(VehicleCam, true)
            RenderScriptCams(true, true, 500, true, true)
            
            if Config.MS == 'high' then
                Citizen.CreateThread(function()
                    while true do
                        if InPreview then
                            ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                        elseif not InPreview then
                            break
                        end
                        Citizen.Wait(1)
                    end
                end)
            elseif Config.MS == 'low' then
                ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
            end
    
            Citizen.CreateThread(function()
                while true do
                    if IsControlJustReleased(0, 177) then
                        SetEntityVisible(PlayerPedId(), true, 1)
                        FreezeEntityPosition(PlayerPedId(), false)
                        PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                        QBCore.Functions.DeleteVehicle(veh)
                        DoScreenFadeOut(200)
                        Citizen.Wait(500)
                        DoScreenFadeIn(200)
                        RenderScriptCams(false, false, 1, true, true)
                        InPreview = false
                        break
                    end
                    Citizen.Wait(1)
                end
            end)
        end, coords, true)
    end
end)

RegisterNetEvent("patrols:PreviewVehicle2")
AddEventHandler("patrols:PreviewVehicle2", function(data)
    if Config.UsePreviewMenuSync then
        QBCore.Functions.TriggerCallback('patrols:CheckIfActive', function(result)
            if result then
                InPreview = true
                local coords = vector4(-448.14, 5994.5, 31.15, 265.16)
                QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
                    SetEntityVisible(PlayerPedId(), false, 1)
                    if Config.SetVehicleTransparency == 'low' then
                        SetEntityAlpha(veh, 400)
                    elseif Config.SetVehicleTransparency == 'medium' then
                        SetEntityAlpha(veh, 93)
                    elseif Config.SetVehicleTransparency == 'high' then
                        SetEntityAlpha(veh, 40)
                    elseif Config.SetVehicleTransparency == 'none' then
                        
                    end
                    FreezeEntityPosition(PlayerPedId(), true)
                    SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
                    exports[Config.FuelSystem]:SetFuel(veh, 0.0)
                    CloseMenu()
                    FreezeEntityPosition(veh, true)
                    SetVehicleEngineOn(veh, false, false)
                    DoScreenFadeOut(200)
                    Citizen.Wait(500)
                    DoScreenFadeIn(200)
                    SetVehicleUndriveable(veh, true)
                
                    VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -443.54, 5997.72, 31.95, 312.66, 0.00, 1.84, 100.00, false, 0)   
                    SetCamActive(VehicleCam, true)
                    RenderScriptCams(true, true, 500, true, true)
                    
                    if Config.MS == 'high' then
                        Citizen.CreateThread(function()
                            while true do
                                if InPreview then
                                    ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                                elseif not InPreview then
                                    break
                                end
                                Citizen.Wait(1)
                            end
                        end)
                    elseif Config.MS == 'low' then
                        ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                    end
            
                    Citizen.CreateThread(function()
                        while true do
                            if IsControlJustReleased(0, 177) then
                                SetEntityVisible(PlayerPedId(), true, 1)
                                FreezeEntityPosition(PlayerPedId(), false)
                                PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                                QBCore.Functions.DeleteVehicle(veh)
                                DoScreenFadeOut(200)
                                Citizen.Wait(500)
                                DoScreenFadeIn(200)
                                RenderScriptCams(false, false, 1, true, true)
                                InPreview = false
                                TriggerServerEvent("patrols:server:SetActive", false)
                                break
                            end
                            Citizen.Wait(1)
                        end
                    end)
                end, coords, true)
            end
        end)
    else
        InPreview = true
        local coords = vector4(-448.14, 5994.5, 31.15, 265.16)
        QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
            SetEntityVisible(PlayerPedId(), false, 1)
            if Config.SetVehicleTransparency == 'low' then
                SetEntityAlpha(veh, 400)
            elseif Config.SetVehicleTransparency == 'medium' then
                SetEntityAlpha(veh, 93)
            elseif Config.SetVehicleTransparency == 'high' then
                SetEntityAlpha(veh, 40)
            elseif Config.SetVehicleTransparency == 'none' then
                SetEntityAlpha(veh, 0)
            end
            FreezeEntityPosition(PlayerPedId(), true)
            SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
            exports[Config.FuelSystem]:SetFuel(veh, 0.0)
            CloseMenu()
            FreezeEntityPosition(veh, true)
            SetVehicleEngineOn(veh, false, false)
            DoScreenFadeOut(200)
            Citizen.Wait(500)
            DoScreenFadeIn(200)
            SetVehicleUndriveable(veh, true)

            VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", -443.54, 5997.72, 32.45, -10.00, 0.00, -230.00, 45.00, false, 0)   
            --VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAME", -443.54, 5997.72, height, verticalrotate, horizontalrotate, left-n-right, zoom, false, 0)   
            SetCamActive(VehicleCam, true)
            RenderScriptCams(true, true, 500, true, true)
            
            if Config.MS == 'high' then
                Citizen.CreateThread(function()
                    while true do
                        if InPreview then
                            ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                        elseif not InPreview then
                            break
                        end
                        Citizen.Wait(1)
                    end
                end)
            elseif Config.MS == 'low' then
                ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
            end
    
            Citizen.CreateThread(function()
                while true do
                    if IsControlJustReleased(0, 177) then
                        SetEntityVisible(PlayerPedId(), true, 1)
                        FreezeEntityPosition(PlayerPedId(), false)
                        PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                        QBCore.Functions.DeleteVehicle(veh)
                        DoScreenFadeOut(200)
                        Citizen.Wait(500)
                        DoScreenFadeIn(200)
                        RenderScriptCams(false, false, 1, true, true)
                        InPreview = false
                        break
                    end
                    Citizen.Wait(1)
                end
            end)
        end, coords, true)
    end
end)

RegisterNetEvent("patrols:PreviewVehicle3")
AddEventHandler("patrols:PreviewVehicle3", function(data)
    if Config.UsePreviewMenuSync then
        QBCore.Functions.TriggerCallback('patrols:CheckIfActive', function(result)
            if result then
                InPreview = true
                local coords = vector4(1815.07, 3665.31, 33.93, 306.52)
                QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
                    SetEntityVisible(PlayerPedId(), false, 1)
                    if Config.SetVehicleTransparency == 'low' then
                        SetEntityAlpha(veh, 400)
                    elseif Config.SetVehicleTransparency == 'medium' then
                        SetEntityAlpha(veh, 93)
                    elseif Config.SetVehicleTransparency == 'high' then
                        SetEntityAlpha(veh, 40)
                    elseif Config.SetVehicleTransparency == 'none' then
                        
                    end
                    FreezeEntityPosition(PlayerPedId(), true)
                    SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
                    exports[Config.FuelSystem]:SetFuel(veh, 0.0)
                    CloseMenu()
                    FreezeEntityPosition(veh, true)
                    SetVehicleEngineOn(veh, false, false)
                    DoScreenFadeOut(200)
                    Citizen.Wait(500)
                    DoScreenFadeIn(200)
                    SetVehicleUndriveable(veh, true)
                    
                    VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 1815.22, 3665.56, 33.93, 303.8, 0.00, 1.84, 100.00, false, 0)   
                    SetCamActive(VehicleCam, true)
                    RenderScriptCams(true, true, 500, true, true)
                    
                    if Config.MS == 'high' then
                        Citizen.CreateThread(function()
                            while true do
                                if InPreview then
                                    ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                                elseif not InPreview then
                                    break
                                end
                                Citizen.Wait(1)
                            end
                        end)
                    elseif Config.MS == 'low' then
                        ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                    end
            
                    Citizen.CreateThread(function()
                        while true do
                            if IsControlJustReleased(0, 177) then
                                SetEntityVisible(PlayerPedId(), true, 1)
                                FreezeEntityPosition(PlayerPedId(), false)
                                PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                                QBCore.Functions.DeleteVehicle(veh)
                                DoScreenFadeOut(200)
                                Citizen.Wait(500)
                                DoScreenFadeIn(200)
                                RenderScriptCams(false, false, 1, true, true)
                                InPreview = false
                                TriggerServerEvent("patrols:server:SetActive", false)
                                break
                            end
                            Citizen.Wait(1)
                        end
                    end)
                end, coords, true)
            end
        end)
    else
        InPreview = true
        local coords = vector4(1815.22, 3665.56, 33.93, 303.8)
        QBCore.Functions.SpawnVehicle(data.vehicle, function(veh)
            SetEntityVisible(PlayerPedId(), false, 1)
            if Config.SetVehicleTransparency == 'low' then
                SetEntityAlpha(veh, 400)
            elseif Config.SetVehicleTransparency == 'medium' then
                SetEntityAlpha(veh, 93)
            elseif Config.SetVehicleTransparency == 'high' then
                SetEntityAlpha(veh, 40)
            elseif Config.SetVehicleTransparency == 'none' then
                
            end
            FreezeEntityPosition(PlayerPedId(), true)
            SetVehicleNumberPlateText(veh, "SASP"..tostring(math.random(1000, 9999)))
            exports[Config.FuelSystem]:SetFuel(veh, 0.0)
            CloseMenu()
            FreezeEntityPosition(veh, true)
            SetVehicleEngineOn(veh, false, false)
            DoScreenFadeOut(200)
            Citizen.Wait(500)
            DoScreenFadeIn(200)
            SetVehicleUndriveable(veh, true)

            VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 1816.94, 3670.58, 34.78, -10.00, 0.00, 161.84, 70.00, false, 0)   
            SetCamActive(VehicleCam, true)
            RenderScriptCams(true, true, 500, true, true)
            
            if Config.MS == 'high' then
                Citizen.CreateThread(function()
                    while true do
                        if InPreview then
                            ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
                        elseif not InPreview then
                            break
                        end
                        Citizen.Wait(1)
                    end
                end)
            elseif Config.MS == 'low' then
                ShowHelpNotification("Press ~INPUT_FRONTEND_RRIGHT~ To Close")
            end
    
            Citizen.CreateThread(function()
                while true do
                    if IsControlJustReleased(0, 177) then
                        SetEntityVisible(PlayerPedId(), true, 1)
                        FreezeEntityPosition(PlayerPedId(), false)
                        PlaySoundFrontend(-1, "NO", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
                        QBCore.Functions.DeleteVehicle(veh)
                        DoScreenFadeOut(200)
                        Citizen.Wait(500)
                        DoScreenFadeIn(200)
                        RenderScriptCams(false, false, 1, true, true)
                        InPreview = false
                        break
                    end
                    Citizen.Wait(1)
                end
            end)
        end, coords, true)
    end
end)