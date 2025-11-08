for (const [key, value] of Object.entries(System)) {
    if (key === "_DEFAULT") continue
    for (const pedElement of value.PEDS.peds) {
        const zoneName = `${GetCurrentResourceName()}_${key}_${pedElement}`
        const interactions = {
            ...System._DEFAULT.INTERACTIONS,
            ...pedElement.INTERACTIONS,
            take: {
                ...System._DEFAULT.INTERACTIONS.take,
                ...pedElement.INTERACTIONS?.take
            },
            return: {
                ...System._DEFAULT.INTERACTIONS.return,
                ...pedElement.INTERACTIONS?.return
            },
            targets: {
                ...System._DEFAULT.INTERACTIONS.targets,
                ...pedElement.INTERACTIONS?.targets
            }
        }
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

function returnVehicle(key) {
    
}