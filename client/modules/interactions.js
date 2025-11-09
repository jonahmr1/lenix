function createInteractions() {
    for (const [key, value] of Object.entries(System)) {
        if (key === "_DEFAULT") continue
        for (const pedElement of value.PEDS.peds) {
            const zoneName = `${GetCurrentResourceName()}_${key}_${pedElement}`
            const interactions = tableFiller(System._DEFAULT.INTERACTIONS, pedElement.INTERACTIONS)
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
                            job: interactions.targets.job,
                            gang: interactions.targets.gang,
                            action: function() {
                                Menu.main(key)
                            },
                        },
                    ],
                    distance: interactions.take.distance,
                }
            )
        }
    }
}