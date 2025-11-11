
function createInteractions() {
  for (const [key, value] of Object.entries(System)) {
    if (key === "_DEFAULT") continue
    for (const pedElement of value.PEDS.peds) {
      const zoneName = `${GetCurrentResourceName()}_${key}_${pedElement}`
      const interactions = tableFiller(System._DEFAULT.INTERACTIONS, pedElement.INTERACTIONS)
      Bridge.target(zoneName, pedElement, interactions, key)
    }
  }
}