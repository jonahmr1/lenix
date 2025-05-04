Config = Config or {}
Config.Interaction = 'interact' -- interact or qb_target

Config.Locations = {
    {
        Coords = vector4(426.68, -973.11, 25.7, 240.64),
        SpawnCoords = vector4(433.66, -975.93, 25.12, 269.6),
        ped = 's_m_y_cop_01',
        scenario = 'WORLD_HUMAN_LEANING',
        label = 'Take A Patrol',
        Job = 'police', -- or {'police', 'swat'}
        Vehicles = {
            { VehicleName = 'Motorcycle Unit', VehicleSpawnName = 'npolmm', Grade = 7 },
            { VehicleName = 'Interception Unit', VehicleSpawnName = 'npolstang', Grade = 7 },
            { VehicleName = 'Motorcycle Interceptor', VehicleSpawnName = '25rnbrt', Grade = 8 },
            { VehicleName = 'GTR Inteceptor', VehicleSpawnName = 'godzilla', Grade = 8 },
        },
    },
    {
        Coords = vector4(1872.88, 3687.57, 33.7, 71.29),
        SpawnCoords = vector4(1869.07, 3686.92, 33.12, 119.45),
        ped = 's_m_y_cop_01',
        scenario = 'WORLD_HUMAN_COP_IDLES',
        label = 'Take A Patrol',
        Job = 'police',
        Vehicles = {
            { VehicleName = 'Motorcycle Unit', VehicleSpawnName = 'npolmm', Grade = 7 },
            { VehicleName = 'Interception Unit', VehicleSpawnName = 'npolstang', Grade = 7 },
            { VehicleName = 'Motorcycle Interceptor', VehicleSpawnName = '25rnbrt', Grade = 8 },
            { VehicleName = 'GTR Inteceptor', VehicleSpawnName = 'godzilla', Grade = 8 },
        },
    },
    {
        Coords = vector4(-441.23, 5994.12, 31.49, 93.31),
        SpawnCoords = vector4(-461.12, 6047.0, 31.15, 315.8),
        ped = 's_f_y_cop_01',
        scenario = 'WORLD_HUMAN_COP_IDLES',
        label = 'Take A Patrol',
        Job = 'police',
        Vehicles = {
            { VehicleName = 'Motorcycle Unit', VehicleSpawnName = 'mtbike', Grade = 7 },
            { VehicleName = 'Interception Unit', VehicleSpawnName = 'npolstang', Grade = 7 },
            { VehicleName = 'Motorcycle Interceptor', VehicleSpawnName = '25rnbrt', Grade = 8 },
            { VehicleName = 'GTR Inteceptor', VehicleSpawnName = 'godzilla', Grade = 8 },
        },
    },
}