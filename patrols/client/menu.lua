RegisterNetEvent('patrols:Menu', function(data)
    if data and data.configName then
        Config.LastSelectedConfig = data.configName
    end

    local Menu = {
        {
            header = "Police Garage",
            txt = "View Vehicles",
            params = {
                event = "patrols:Catalog",
                args = {
                    configName = Config.LastSelectedConfig
                }
            }
        }
    }
    Menu[#Menu+1] = {
        header = "Preview Vehicles",
        txt = "View Vehicles",
        params = {
            event = "patrols:PreviewCarMenu",
            args = {
                configName = Config.LastSelectedConfig
            }
        }
    }
    if not Config.UseMarkerInsteadOfMenu then
        Menu[#Menu+1] = {
            header = "⬅ Store Vehicle",
            params = {
                event = "patrols:StoreVehicle"
            }
        }
    end
    Menu[#Menu+1] = {
        header = "⬅ Close Menu",
        params = {
            event = "qb-menu:client:closeMenu"
        }
    }
    exports['qb-menu']:openMenu(Menu)
end)