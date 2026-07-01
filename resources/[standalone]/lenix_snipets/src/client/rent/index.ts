import { cache } from "@overextended/ox_lib"
import { requestModel, notify, createVehicle } from "@overextended/ox_lib/client"

interface Ped {
	model: string
	coords: Vector4
	spawn: Vector4
	scenario?: string
}

type Vector3 = [number, number, number]
type Vector4 = [number, number, number, number]

const PEDS: Ped[] = [
	{
		model: "a_m_m_prolhost_01",
		coords: [-252.2817, -297.2987, 21.6264, 69.0925],
		spawn: [-256.1688, -333.2883, 29.1064, 9.2070],
		scenario: "WORLD_HUMAN_CLIPBOARD",
	},
	{
		model: "a_m_m_prolhost_01",
		coords: [-295.1785, -622.0973, 32.7741, 175.3196],
		spawn: [-301.8000, -626.5660, 32.1928, 271.8865],
		scenario: "WORLD_HUMAN_CLIPBOARD"
	},
]

const getClosestObject = (
	coords: Vector3,
	maxDistance = 2.0
): [number | undefined, Vector3 | undefined] => {
	const objects = GetGamePool('CObject')

	let closestObject: number | undefined
	let closestCoords: Vector3 | undefined

	for (const object of objects) {
		const objectCoords = GetEntityCoords(object, true) as Vector3
		const distance = GetDistanceBetweenCoords(
			coords[0],
			coords[1],
			coords[2],
			objectCoords[0],
			objectCoords[1],
			objectCoords[2],
			true
		)

		if (distance < maxDistance) {
			maxDistance = distance
			closestObject = object
			closestCoords = objectCoords
		}
	}

	return [closestObject, closestCoords]
}

setImmediate(() => {
	PEDS.map(async ({ model, coords, spawn, scenario }) => {
		const requestedModel = await requestModel(model)
		if (!requestedModel) return
	
		const entity = CreatePed(0, requestedModel, coords[0], coords[1], coords[2] - 1.0, coords[3], false, true)
		if (scenario) {
			TaskStartScenarioInPlace(entity, scenario, 0, true)
		}
		
		SetModelAsNoLongerNeeded(model)
		FreezeEntityPosition(entity, true)
		SetEntityInvincible(entity, true)
		SetBlockingOfNonTemporaryEvents(entity, true)

		exports.ox_target.addLocalEntity(entity, [
			{
				icon: 'fas fa-car',
				label: 'Take a car',
				onSelect: async () => {
					const occupied = IsPositionOccupied(
						spawn[0],
						spawn[1],
						spawn[2],
						3.0,
						false,
						true,
						true,
						false,
						false,
						0,
						false
					)
					
					if (occupied) {
						notify({
							title: 'Spawn point is occupied.'
						})
						return
					}
					const vehicle = await createVehicle('cypher', ...spawn)
					TaskWarpPedIntoVehicle(cache.ped, vehicle.handle, -1)
				}
			}
		])
	})
})