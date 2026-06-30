//TODO: serverify the logic
import { addRadialItem, cache, createVehicle, notify, requestModel } from "@overextended/ox_lib/client"

interface Ped {
	model: string
	coords: [number, number, number, number]
	scenario?: string
}

const SPAWN_LOCATION: [number, number, number, number] = [-256.1688, -333.2883, 29.1064, 9.2070]

const PEDS: Ped[] = [
	{
		model: "a_m_m_prolhost_01",
		coords: [-252.2817, -297.2987, 21.6264, 69.0925],
		scenario: "WORLD_HUMAN_CLIPBOARD"
	}
]

setImmediate(() => {
	PEDS.map(async ({ model, coords, scenario }) => {
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
					const vehicle = await createVehicle('cypher', ...SPAWN_LOCATION)
					TaskWarpPedIntoVehicle(cache.ped, vehicle.handle, -1)
				}
			}
		])
	})
})

addRadialItem([
  {
    id: 'police',
    label: 'Police',
    icon: 'shield-halved',
		onSelect: () => {
			notify({
				title: 'ابو داحم'
			})
		}
  },
  {
    id: 'business_stuff',
    label: 'Business',
    icon: 'briefcase',
    onSelect: () => {
			notify({
				title: 'Lenix!'
			})
    }
  }
])