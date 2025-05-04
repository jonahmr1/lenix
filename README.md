# patrol

```lua
Config.Interaction = '' ---@param interaction_script interact | qb_target
Config.FuelSystem = '' ---@param fuel_script cdn-fuel | LegacyFuel
Config.Locations = {
    {
        Coords = vector4(x, y, z, w), ---@param ped_location
        SpawnCoords = vector4(x, y, z, w), ---@param vehicle_spawn_location
        ped = '', ---@param ped_model
        scenario = '', ---@param ped_scenario
        label = '', ---@param ped_target_label
        Job = '', ---@param allowance_to_the_menu job
        Vehicles = {
            { VehicleName = '', VehicleSpawnName = '', Grade = 0 }, ---@param vehicle_config vehicle_label vehicle_model player grade
            ...
        }
    }
}
```