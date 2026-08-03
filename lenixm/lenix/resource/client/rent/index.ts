import { cache } from '@overextended/ox_lib'
import { notify, createVehicle, registerContext, showContext, createPed } from '@overextended/ox_lib/client'
import { api } from 'lenix'
import type { Vector4 } from 'types'

let lastVehicle: number
let vehicleInterval: ReturnType<typeof setInterval>

const MENUS = {
	police: ['police', 'police2'],
}

const PEDS: {
	coords: Vector4
	spawn: Vector4
	menu?: string[]
}[] = [
	{
		coords: [-252.2817, -297.2987, 21.6264, 69.0925],
		spawn: [-256.1688, -333.2883, 29.1064, 9.207],
	},
	{
		coords: [-295.1785, -622.0973, 32.7741, 175.3196],
		spawn: [-301.8, -626.566, 32.1928, 271.8865],
	},
	{
		coords: [1851.5194, 2583.6697, 45.6639, 357.8237],
		spawn: [1855.4651, 2578.8855, 45.4116, 271.0542],
	},
	{
		coords: [-292.8378, -985.7634, 31.0969, 41.8034],
		spawn: [-301.6614, -990.4818, 31.0812, 343.2394],
	},
	{
		coords: [418.6655, -991.6953, 21.3117, 90.1289],
		spawn: [429.1385, -986.8941, 21.3117, 91.0006],
		menu: MENUS.police,
	},
]

const handleVehicleDeletion = (vehicle: number) => {
	clearInterval(vehicleInterval)

	const deleteAfter = 15 * 60 * 1000
	const warnAt = deleteAfter * 0.1
	const pollInterval = Math.min(5000, Math.max(500, warnAt / 4))
	let emptySince = GetGameTimer()
	let warned = false

	vehicleInterval = setInterval(() => {
		if (!DoesEntityExist(vehicle)) {
			clearInterval(vehicleInterval)
			return
		}

		const occupied = GetVehicleNumberOfPassengers(vehicle) > 0 || !IsVehicleSeatFree(vehicle, -1)
		if (occupied) {
			emptySince = GetGameTimer()
			warned = false
			return
		}

		const remaining = deleteAfter - (GetGameTimer() - emptySince)

		if (remaining <= warnAt && !warned) {
			warned = true
			notify({
				title: `Your unattended vehicle will be removed in ${Math.ceil(warnAt / 1000)} seconds.`,
				type: 'warning',
			})
		}

		if (remaining <= 0) {
			DeleteEntity(vehicle)
			clearInterval(vehicleInterval)
		}
	}, pollInterval)
}

const spawnVehicle = async (model: string, spawn: Vector4) => {
	if (lastVehicle && DoesEntityExist(lastVehicle)) {
		DeleteEntity(lastVehicle)
	}

	const vehicle = await createVehicle(model, ...spawn)
	TaskWarpPedIntoVehicle(cache.ped, vehicle.handle, -1)
	lastVehicle = vehicle.handle
	handleVehicleDeletion(vehicle.handle)
}

setImmediate(() => {
	PEDS.map(async ({ coords, spawn, menu }) => {
		const entity = await createPed('a_m_m_prolhost_01', ...coords, true)
		if (!entity) return

		api.ox_target?.addLocalEntity?.(entity, [
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
						false,
					)

					if (occupied) {
						notify({
							title: 'Spawn point is occupied.',
						})
						return
					}
					if (menu) {
						registerContext({
							id: 'rent_menu',
							title: 'Car List',
							options: [
								...menu.map(model => ({
									title: model,
									onSelect: () => spawnVehicle(model, spawn),
								})),
							],
						})
						showContext('rent_menu')
						return
					}
					spawnVehicle('cypher', spawn)
				},
			},
		])
	})
})
