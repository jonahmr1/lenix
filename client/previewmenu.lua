RegisterNetEvent('lenix_patrolvehicles:previewmenu', function(data)
    local config = data.config
    local spawn = data.spawn
    local preview = data.preview
    
    local options = {}

    if Config.Vehicles[config] then
        for _, vehicle in ipairs(Config.Vehicles[config]) do
            options[#options+1] = {
                title = vehicle.vehiclename,
                description = "Preview: " .. vehicle.vehiclename,
                icon = "fas fa-search",
                image = vehicle.image, -- Add vehicle image if available
                onSelect = function()
                    TriggerEvent("lenix_patrolvehicles:preview", {
                        vehicle = vehicle.vehicle,
                        preview = preview,
                    })
                end
            }
        end
    else
        print("Warning: No vehicles found for config: " .. json.encode(data))
    end

    -- Add back button at the end
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

    lib.registerContext({
        id = 'patrols_preview_menu',
        title = 'Preview Menu',
        options = options
    })

    lib.showContext('patrols_preview_menu')
end)