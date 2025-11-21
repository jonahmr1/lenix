# Bridges

exports['qb-menu'].openMenu(options)

exports['qb-core'].Notify(message, type)


return exports['qb-core'].GetSharedVehicles()[key]


exports['qb-target'].AddBoxZone(
    zoneName,
    {
      x: pedElement.coords[0],
      y: pedElement.coords[1],
      z: pedElement.coords[2]
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
          job: interactions.targets?.job,
          gang: interactions.targets?.gang,
          action: function () {
            Menu.main(key)
          },
        },
        {
          type: "client",
          icon: interactions.return.icon,
          label: interactions.return.label,
          job: interactions.targets?.job,
          gang: interactions.targets?.gang,
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