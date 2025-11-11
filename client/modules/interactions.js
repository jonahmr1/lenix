function createInteractions() {
  for (const [key, value] of Object.entries(System)) {
    if (key === "_DEFAULT") continue
    for (const pedElement of value.PEDS.peds) {
      const zoneName = `${'lenix_vehicles'}_${key}_${pedElement.coords[0]}_${pedElement.coords[1]}_${pedElement.coords[2]}`
      const interactions = tableFiller(System._DEFAULT.INTERACTIONS, System[key].INTERACTIONS)
      Bridge.target(zoneName, pedElement, interactions, key)
    }
  }
}