local QBCore = exports['qb-core']:GetCoreObject()

RegisterNetEvent('lenix_patrolvehicles:menu', function(data)
    local config = data.config
    local spawn = data.spawn
    local preview = data.preview

    local options = {
        {
            title = "Police Vehicles",
            description = "Browse police vehicles",
            icon = "fas fa-car",
            onSelect = function()
                TriggerEvent("lenix_patrolvehicles:list", {
                    config = config,
                    spawn = spawn,
                    preview = preview
                })
            end
        },
        {
            title = "Preview Vehicles", 
            description = "Preview available vehicles",
            icon = "fas fa-eye",
            onSelect = function()
                TriggerEvent("lenix_patrolvehicles:previewmenu", {
                    config = config,
                    preview = preview,
                    spawn = spawn
                })
            end
        },
        {
            title = "Store Vehicle",
            description = "Return your current vehicle",
            icon = "fas fa-warehouse",
            onSelect = function()
                TriggerEvent("lenix_patrolvehicles:return")
            end
        }
    }

    lib.registerContext({
        id = 'patrols_main_menu',
        title = 'Patrols Vehicles',
        options = options
    })

    lib.showContext('patrols_main_menu')
end)

RegisterNetEvent("lenix_patrolvehicles:list", function(data)
    local config = data.config
    local spawn = data.spawn
    local preview = data.preview
    
    local options = {}

    -- Add back button
    options[#options+1] = {
        title = "⬅ Go Back",
        description = "Return to main menu",
        icon = "fas fa-arrow-left",
        onSelect = function()
            TriggerEvent("lenix_patrolvehicles:menu", {
                config = config,
                spawn = spawn,
                preview = preview
            })
        end
    }

    if Config.Vehicles[config] then
        local playerJob = QBCore.Functions.GetPlayerData().job.name
        local playerGrade = QBCore.Functions.GetPlayerData().job.grade.level
    
        for _, vehicle in ipairs(Config.Vehicles[config]) do
            -- Check if player has required job grade
            if vehicle.allowed and vehicle.allowed[playerJob] and playerGrade >= vehicle.allowed[playerJob] then
                local description = vehicle.Registerable 
                    and ("Get: " .. vehicle.vehiclename .. " For: $" .. vehicle.price)
                    or ("Take Out " .. vehicle.vehiclename)
    
                options[#options+1] = {
                    title = vehicle.vehiclename,
                    description = description,
                    icon = vehicle.Registerable and "fas fa-dollar-sign" or "fas fa-key",
                    image = vehicle.image, -- Add vehicle image if available
                    serverEvent = "lenix_patrolvehicles:charge",
                    args = {
                        price = vehicle.price,
                        vehiclename = vehicle.vehiclename,
                        vehicle = vehicle.vehicle,
                        config = config,
                        spawn = spawn,
                        chargeable = vehicle.Registerable,
                    }
                }
            end
        end
    else
        print("Warning: No vehicles found for config: " .. tostring(config))
    end

    lib.registerContext({
        id = 'patrols_vehicle_list',
        title = 'Government Vehicles',
        options = options
    })

    lib.showContext('patrols_vehicle_list')
end)