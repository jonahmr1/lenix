Config = Config or {}
Config.Interaction = 'interact'
Config.FuelSystem = 'cdn-fuel'
Config.Locations = {
    {
        Coords = vector4(579.62, 30.53, 92.37, 342.58),
        SpawnCoords = vector4(577.98, 38.98, 92.45, 228.11),
        ped = 's_m_y_cop_01',
        scenario = 'WORLD_HUMAN_LEANING',
        label = 'Take A Patrol',
        Job = 'police',
        Vehicles = {
            { VehicleName = 'Stanier', VehicleSpawnName = 'police', Grade = 0 },
            { VehicleName = 'Buffalo', VehicleSpawnName = 'police2', Grade = 1 },
            { VehicleName = 'Cruiser', VehicleSpawnName = 'police3', Grade = 2 },
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
            { VehicleName = 'Stanier', VehicleSpawnName = 'police', Grade = 0 },
            { VehicleName = 'Buffalo', VehicleSpawnName = 'police2', Grade = 1 },
            { VehicleName = 'Cruiser', VehicleSpawnName = 'police3', Grade = 2 },
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
            { VehicleName = 'Stanier', VehicleSpawnName = 'police', Grade = 0 },
            { VehicleName = 'Buffalo', VehicleSpawnName = 'police2', Grade = 1 },
            { VehicleName = 'Cruiser', VehicleSpawnName = 'police3', Grade = 2 },
        },
    },
}