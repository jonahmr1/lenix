RegisterNetEvent("patrols:Catalog", function()
    local vehicleMenu = {
        {
            header = "Government Vehicles",
            isMenuHeader = true,
        }
    }

    local configName = Config.LastSelectedConfig or "police"

    if Config.Vehicles[configName] then
        for i, v in ipairs(Config.Vehicles[configName]) do
            vehicleMenu[#vehicleMenu+1] = {
                header = v.vehiclename,
                txt = "Buy: " .. v.vehiclename .. " For: " .. v.price .. "$",
                params = {
                    isServer = true,
                    event = "patrols:charge",
                    args = {
                        price = v.price,
                        vehiclename = v.vehiclename,
                        vehicle = v.vehicle,
                        configName = configName
                    }
                }
            }
        end
    else
        print("Error: Config not found: " .. tostring(configName))
    end

    vehicleMenu[#vehicleMenu+1] = {
        header = "⬅ Go Back",
        params = {
            event = "patrols:Menu"
        }
    }
    exports['qb-menu']:openMenu(vehicleMenu)
end)