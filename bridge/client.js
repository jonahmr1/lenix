let Bridge = {}

Bridge.giveKey = (plate) => {
  emitNet('qb-vehiclekeys:server:AcquireVehicleKeys', plate)
}

Bridge.setFuel = (handle, fuel) => {
  Entity(handle).state.fuel = fuel
}