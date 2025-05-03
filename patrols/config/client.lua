Config = Config or {}
Config.FuelSystem = 'cdn-fuel'

Config.Interact = {
    {
        interact = 'qb_target',
        distance = 5,
        interactDst = 2,
        label = 'Police Garage',
        icon = 'fas fa-car',
        ped = 's_f_y_cop_01',
        scenario = 'WORLD_HUMAN_CLIPBOARD',
        coords = vector4(460.07, -1000.31, 25.7, 38.17),
        spawn = vector4(458.73, -993.54, 24.97, 4.34),
        preview = {
            coords = vector4(458.73, -993.54, 24.97, 4.34),
            cam = {
                coords = vector3(455.64, -988.14, 26.35),
                rotation = {
                    verticalrotate = -10.00,
                    horizontalrotate = 0.00,
                    left_n_right = -145.0,
                },
                fov = 40.0
            }
        },
        config = 'police',
        jobs = {
            police = 0,
            sheriff = 0,
        },
    },
    {
        interact = 'interact',
        distance = 5,
        interactDst = 2,
        icon = 'fas fa-car',
        label = 'Sheriff Garage',
        ped = 's_f_y_cop_01',
        scenario = 'WORLD_HUMAN_COP_IDLES',
        coords = vector4(1828.33, 3671.63, 34.34, 71.09),
        spawn = vector4(1815.27, 3665.58, 33.59, 298.07),
        preview = {
            coords = vector4(1815.22, 3665.56, 33.93, 303.8),
            cam = {
                coords = vector3(1816.94, 3670.58, 34.78),
                rotation = {
                    verticalrotate = -10.00,
                    horizontalrotate = 0.00,
                    left_n_right = 161.84,
                },
                fov = 100.00
            }
        },
        config = 'police',
        jobs = {
            police = 0,
            sheriff = 0,
        },
    },
    {
        interact = 'interact',
        distance = 5,
        interactDst = 2,
        label = 'Police Garage',
        ped = 's_m_y_cop_01',
        scenario = 'WORLD_HUMAN_CLIPBOARD',
        coords = vector4(-460.89, 6051.23, 31.34, 174.82),
        spawn = vector4(-460.64, 6046.97, 30.76, 132.34),
        preview = {
            coords = vector4(-448.14, 5994.5, 31.15, 265.16),
            cam = {
                coords = vector3(-443.54, 5997.72, 32.45),
                rotation = {
                    verticalrotate = -10.00,
                    horizontalrotate = 0.00,
                    left_n_right = 161.84,
                },
                fov = 100.00
            }
        },
        config = 'police',
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
            allowed = {
                police = 0,
                sheriff = 0,
            },
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
            allowed = {
                police = 0,
                sheriff = 0,
            },
            price = 45000,
            Registerable = false,
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
            vehiclename = "Ford Taurus",
            vehicle = "mttur",
            allowed = {
                police = 0,
                sheriff = 0,
            },
            price = 50000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 1,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Dodge Charger",
            vehicle = "npolchar",
            allowed = {
                police = 0,
                sheriff = 0,
            },
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
            allowed = {
                police = 0,
                sheriff = 0,
            },
            price = 60000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 1,
                r = 81,
                g = 84,
                b = 89,
            }
        },
        {
            vehiclename = "Dodge Challenger",
            vehicle = "npolchal",
            allowed = {
                police = 0,
                sheriff = 0,
            },
            price = 70000,
            Registerable = true,
            plate = {"SASP0", 100, 999},
            style = {
                isenabled = true,
                livery = 0,
                r = 81,
                g = 84,
                b = 89,
            }
        },
    },
}