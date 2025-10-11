locations = {
  {
      coords = vector4(x, y, z, w), ---@param ped_location
      spawnCoords = vector4(x, y, z, w), ---@param vehicle_spawn_location
      ped = '', ---@param ped_model
      scenario = '', ---@param ped_scenario
      label = '', ---@param ped_target_label
      job = '', ---@param allowance_to_the_menu job
      vehicles = {
          { vehicleName = '', vehicleSpawnName = '', grade = 0 }, ---@param vehicle_config vehicle_label vehicle_model player grade
          ...
      }
  }
}