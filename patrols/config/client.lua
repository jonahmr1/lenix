Config = Config or {}

Config.FuelSystem = 'cdn-fuel'
Config.UsePreviewMenuSync = false
Config.UseMarkerInsteadOfMenu = true
Config.SetVehicleTransparency = 'none'
Config.MS = 'high'
Config.Job = 'police'
Config.LastSelectedConfig = nil

Config.Interact = {
    {
        interact = 'interact',
        coords = vector4(460.07, -1000.31, 25.7, 38.17),
        spawn = vector4(458.73, -993.54, 24.97, 4.34),  -- City PD spawn
        ped = 's_f_y_cop_01',
        scenario = 'WORLD_HUMAN_CLIPBOARD',
        label = 'Police Garage',
        icon = 'fas fa-car',
        config = "police",
        jobs = {
            police = 0,
            sheriff = 0,
        },
    },
    {
        interact = 'interact',
        coords = vector4(1828.33, 3671.63, 34.34, 71.09),
        spawn = vector4(1815.27, 3665.58, 33.59, 298.07),  -- Fixed to Sandy Shores coordinates 
        ped = 's_f_y_cop_01',
        scenario = 'WORLD_HUMAN_COP_IDLES',
        label = 'Sheriff Garage',
        config = "sheriff",
        jobs = {
            police = 0,
            sheriff = 0,
        },
    },
    {
        interact = 'interact',
        coords = vector4(-460.89, 6051.23, 31.34, 174.82),
        spawn = vector4(-448.14, 5994.5, 31.15, 265.16),  -- Fixed to Paleto Bay coordinates
        ped = 's_m_y_cop_01',
        scenario = 'WORLD_HUMAN_CLIPBOARD',
        label = 'Police Garage',
        icon = 'fas fa-car',
        config = "police",
        jobs = {
            police = 0,
            sheriff = 0,
        },
    },
}

Config.Vehicles = {
    police = {
        {
            vehiclename = "Ford Victoria",
            vehicle = "npolvic",
            price = 40000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Ford Explorer",
            vehicle = "npolexp",
            price = 45000,
            Registerable = false,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 255,
                g = 0,
                b = 0,
            }
        },
        {
            vehiclename = "Ford Taurus",
            vehicle = "mttur",
            price = 50000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Dodge Charger",
            vehicle = "npolchar",
            price = 55000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Dodge Durango",
            vehicle = "mtdur",
            price = 60000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Dodge Challenger",
            vehicle = "npolchal",
            price = 70000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Ford Explorer",
            vehicle = "soexplorer",
            price = 45000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Chevrolet Tahoe",
            vehicle = "sotahoe",
            price = 65000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 3,
                r = 50,
                g = 50,
                b = 50,
            }
        },
        {
            vehiclename = "Dodge Charger",
            vehicle = "socharger",
            price = 55000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Ford F150",
            vehicle = "sotruck",
            price = 70000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
    },
    sheriff = {
        {
            vehiclename = "Ford Explorer",
            vehicle = "soexplorer",
            price = 45000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 4,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Chevrolet Tahoe",
            vehicle = "vstr",
            price = 65000,
            Registerable = false,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 3,
                r = 50,
                g = 50,
                b = 50,
            }
        },
    }
}