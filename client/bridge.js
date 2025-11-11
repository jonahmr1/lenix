const Vehicles = exports['qb-core'].GetSharedVehicles()
let Bridge = {}

onNet('QBCore:Client:OnPlayerLoaded', function() {
  Initialization(Bridge.getPlayerJob())
})

onNet('QBCore:Client:OnJobUpdate', function(UpdatedData) {
  PlayerJob = UpdatedData
})

Bridge.getPlayerJob = function() {
  return QBCore.Functions.GetPlayerData().job
}

Bridge.setFuel = function(handle, fuel) {
  exports['qb-fuel'].SetFuel(handle, fuel)
}

Bridge.notify = function(message, type) {
  exports['qb-core'].Notify(message, type)
}

Bridge.target = function(zoneName, pedElement, interactions, key) {
  exports['qb-target'].AddBoxZone(
    zoneName,
    {
      x: pedElement.coords[0],
      y: pedElement.coords[1],
      z: pedElement.coords[2] + 1.0
    },
    3.45,
    3.35,
    {
      name: zoneName,
      heading: pedElement.coords[3],
      debugPoly: interactions.debug,
      minZ: pedElement.coords[2] - 1.0,
      maxZ: pedElement.coords[2] + 1.0,
    },
    {
      options: [
        {
          type: "client",
          icon: interactions.take.icon,
          label: interactions.take.label,
          job: interactions.targets.job,
          gang: interactions.targets.gang,
          action: function () {
            Menu.main(key)
          },
        },
        {
          type: "client",
          icon: interactions.return.icon,
          label: interactions.return.label,
          job: interactions.targets.job,
          gang: interactions.targets.gang,
          canInteract: function () {
            return NetIdsRequested.length !== 0
          },
          action: async function () {
            await returnVehicle(NetIdsRequested)
          },
        },
      ],
      distance: interactions.take.distance,
    }
  )
}