let Bridge = {}

onNet('QBCore:Client:OnPlayerLoaded', function() {
  Initialization(Bridge.getPlayerJob())
})

onNet('QBCore:Client:OnJobUpdate', function(UpdatedData) {
  PlayerJob = UpdatedData
})

Bridge.getVehicles = (key) => {
  return exports.qbx_core.GetVehiclesByName(key)
}

Bridge.getPlayerJob = () => {
  const playerJob = QBCore.Functions.GetPlayerData().job
  return { name: playerJob.name, gradeLevel: playerJob.grade.level }
}

Bridge.getPlayerGang = () => {
  const playerGang = QBCore.Functions.GetPlayerData().gang
  return { name: playerGang.name, gradeLevel: playerGang.grade.level }
}

Bridge.setFuel = (handle, fuel) => {
  Entity(handle).state.fuel = fuel
}

Bridge.notify = (message, type) => {
  exports.qbx_core.Notify(message, type)
}

Bridge.target = (zoneName, pedElement, interactions, key) => {
  exports.ox_target.addBoxZone({
    coords: {
      x: pedElement.coords[0],
      y: pedElement.coords[1],
      z: pedElement.coords[2]
    },
    name: zoneName,
    size: {
      x: 3.45,
      y: 3.35,
      z: 2.0
    },
    rotation: pedElement.coords[3],
    debug: interactions.debug,
    options: [
      {
        label: interactions.take.label,
        groups: (interactions.targets?.job || interactions.targets?.gang) ? [
          interactions.targets?.job,
          interactions.targets?.gang
        ] : undefined,
        distance: interactions.take.distance,
        onSelect: () => {
          Menu.main(key)
        }
      },
      {
        label: interactions.return.label,
        groups: (interactions.targets?.job || interactions.targets?.gang) ? [
          interactions.targets?.job,
          interactions.targets?.gang
        ] : undefined,
        distance: interactions.take.distance,
        canInteract: () => {
          return NetIdsRequested.length !== 0
        },
        onSelect: async () => {
          await returnVehicle(NetIdsRequested)
        }
      }
    ]
  })
}

Bridge.menu = Bridge.menu || {};

Bridge.menu.open = (main, options) => {
  exports.lenix_vehicles.open(main, options)
};

Bridge.menu.close = () => {
  exports.lenix_vehicles.close()
};

Bridge.drawText = {
  show: () => {
    exports['qb-core'].DrawText('⇽', 'right')
  },
  hide: () => {
    exports['qb-core'].HideText()
  }
}