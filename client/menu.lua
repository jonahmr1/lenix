local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('patrols:menu', function(data)
    local config = data.config
    local spawn = data.spawn
    local preview = data.preview

    local Menu = {
        {
            header = "Patrols Vehicles",
            isMenuHeader = true,
        },
        {
            header = "Police Vehicles",
            txt = "Next",
            params = {
                event = "patrols:list",
                args = {
                    config = config,
                    spawn = spawn,
                    preview = preview
                }
            }
        },
    }
    Menu[#Menu+1] = {
        header = "Preview Vehicles",
        txt = "Next",
        params = {
            event = "patrols:previewmenu",
            args = {
                config = config,
                preview = preview,
                spawn = spawn
            }
        }
    }
    Menu[#Menu+1] = {
        header = "⬅ Store Vehicle",
        params = {
            event = "patrols:return"
        }
    }
    Menu[#Menu+1] = {
        header = "Close Menu",
        params = {
            event = "qb-menu:client:closeMenu"
        }
    }
    exports['qb-menu']:openMenu(Menu)
end)

RegisterNetEvent("patrols:list", function(data)
    local config = data.config
    local spawn = data.spawn
    local preview = data.preview
    
    local vehicleMenu = {
        {
            header = "Government Vehicles",
            isMenuHeader = true,
        }
    }

    vehicleMenu[#vehicleMenu+1] = {
        header = "⬅ Go Back",
        params = {
            event = "patrols:menu",
            args = {
                config = config
            }
        }
    }

    if Config.Vehicles[config] then
        local playerJob = QBCore.Functions.GetPlayerData().job.name
        local playerGrade = QBCore.Functions.GetPlayerData().job.grade.level
    
        for _, vehicle in ipairs(Config.Vehicles[config]) do
            -- Check if player has required job grade
            if vehicle.allowed and vehicle.allowed[playerJob] and playerGrade >= vehicle.allowed[playerJob] then
                local txt = vehicle.Registerable 
                    and ("Get: " .. vehicle.vehiclename .. " For: " .. vehicle.price .. "$")
                    or ("Take Out " .. vehicle.vehiclename)
    
                vehicleMenu[#vehicleMenu+1] = {
                    header = vehicle.vehiclename,
                    txt = txt,
                    params = {
                        isServer = true,
                        event = "patrols:charge",
                        args = {
                            price = vehicle.price,
                            vehiclename = vehicle.vehiclename,
                            vehicle = vehicle.vehicle,
                            config = config,
                            spawn = spawn,
                            chargeable = vehicle.Registerable,
                        }
                    }
                }
            end
        end
    else
        print("Warning: No vehicles found for config: " .. tostring(config))
    end
    exports['qb-menu']:openMenu(vehicleMenu)
end)