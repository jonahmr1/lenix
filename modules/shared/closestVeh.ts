export const closestVeh = (entity: number, radialSpace: number): number | undefined => {
  const coords = GetEntityCoords(entity)
  const vehicles = GetGamePool('CVehicle') as number[]

  let closest: number | undefined
  let closestDistance = radialSpace

  for (const vehicle of vehicles) {
    const vehCoords = GetEntityCoords(vehicle)
    const x = coords[0] - vehCoords[0]
    const y = coords[1] - vehCoords[1]
    const z = coords[2] - vehCoords[2]
    const distance = Math.sqrt(x * x + y * y + z * z)

    if (distance < closestDistance) {
      closestDistance = distance
      closest = vehicle
    }
  }

  return closest
}
