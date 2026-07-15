export const closestVeh = (entity: number, radialSpace: number): number | undefined => {
  const coords = GetEntityCoords(entity, true)
  const vehicles = GetGamePool('CVehicle') as number[]

  let closest: number | undefined
  let closestDistance = radialSpace

  for (const vehicle of vehicles) {
    const vehCoords = GetEntityCoords(vehicle, true)
    const distance = Vdist(coords[0], coords[1], coords[2], vehCoords[0], vehCoords[1], vehCoords[2])

    if (distance < closestDistance) {
      closestDistance = distance
      closest = vehicle
    }
  }

  return closest
}