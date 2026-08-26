import { GetPlayer } from '@overextended/ox_core/client'
import { cache, checkDependency, disableRadial, getNearbyVehicles, notify, requestAnimDict, skillCheck, sleep } from '@overextended/ox_lib/client'
import { Vector3 } from '@overextended/core/vector'
import { api, entity, getNearest, player, pool } from 'lenix/client'
import type { Vec3 } from 'lenix'

checkDependency('ox_lib', '3.39.0', true)
checkDependency('ox_core', '1.5.14', true)
checkDependency('ox_target', '1.18.1', true)

let isCuffed = false

const anims = [
	{ dict: 'mp_arresting', anim: 'idle' },
	{ dict: 'mp_arrest_paired', anim: 'crook_p2_back_right' },
]
const ALLOWED_CONTROLS = new Set([
	0, // INPUT_NEXT_CAMERA
	1, // INPUT_LOOK_LR
	2, // INPUT_LOOK_UD
	3, // INPUT_LOOK_UP_ONLY
	4, // INPUT_LOOK_DOWN_ONLY
	5, // INPUT_LOOK_LEFT_ONLY
	6, // INPUT_LOOK_RIGHT_ONLY
	21, // INPUT_SPRINT
	30, // INPUT_MOVE_LR
	31, // INPUT_MOVE_UD
	32, // INPUT_MOVE_UP_ONLY
	33, // INPUT_MOVE_DOWN_ONLY
	34, // INPUT_MOVE_LEFT_ONLY
	35, // INPUT_MOVE_RIGHT_ONLY
	218, // INPUT_SCRIPT_LEFT_AXIS_X
	219, // INPUT_SCRIPT_LEFT_AXIS_Y
	220, // INPUT_SCRIPT_RIGHT_AXIS_X
	221, // INPUT_SCRIPT_RIGHT_AXIS_Y
	245, // INPUT_MP_TEXT_CHAT_ALL
	266, // INPUT_MOVE_LEFT
	267, // INPUT_MOVE_RIGHT
	268, // INPUT_MOVE_UP
	269, // INPUT_MOVE_DOWN
	270, // INPUT_LOOK_LEFT
	271, // INPUT_LOOK_RIGHT
	272, // INPUT_LOOK_UP
	273, // INPUT_LOOK_DOWN
])

const getNearestVehicle = (coords: Vec3): [Vec3 | undefined, number | undefined] => {
	const vehicles = getNearbyVehicles(new Vector3(...coords), 3.0)
	const zoneCoords: Vec3[] = vehicles.map(({ coords: { x, y, z } }) => [x, y, z])

	const closestCoords = getNearest.coords(coords, zoneCoords)
	const closestVehicle = vehicles.find(vehicle =>
		vehicle.coords.toArray().every((vehicle, i) => vehicle === closestCoords?.[i]),
	)?.vehicle
	return [closestCoords, closestVehicle]
}

const cuffingAnimation = async () => {
	await entity.playAnim(cache.ped, 'mp_arrest_paired', 'cop_p2_back_right')

	await sleep(3500)

	await entity.playAnim(cache.ped, 'mp_arrest_paired', 'exit')
	entity.stopAnim(cache.ped, 'mp_arrest_paired')
}

const gettingCuffedAnimation = async (playerId: number) => {
	const cuffer = GetPlayerPed(GetPlayerFromServerId(playerId))
	const heading = GetEntityHeading(cuffer)

	await requestAnimDict('mp_arrest_paired')

	const offset = GetOffsetFromEntityInWorldCoords(cuffer, 0.0, 0.45, 0.0) as Vec3
	entity.teleport(...offset, heading)

	await sleep(100)
	await entity.playAnim(cache.ped, 'mp_arrest_paired', 'crook_p2_back_right')
	await sleep(2500)

	entity.stopAnim(cache.ped, 'mp_arrest_paired')
}

const setCuffs = async () => {
	if (!isCuffed) return

	DisableAllControlActions(0)
	for (const control of ALLOWED_CONTROLS) {
		EnableControlAction(0, control, true)
	}

	for (const anim of anims) {
		if (IsEntityPlayingAnim(cache.ped, anim.dict, anim.anim, 3)) return
	}

	await requestAnimDict('mp_arresting')
	entity.playAnim(cache.ped, 'mp_arresting', 'idle', 8.0, -8.0)
}

on('lenix:client:interactions:putInVehicle', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}

	const nearest = getNearest.player(coords as Vec3, 2.0, false)
	if (!nearest.playerId || !nearest.playerPed) {
		notify({ title: 'No one nearby!' })
		return
	}

	const targetId = GetPlayerServerId(nearest.playerId)
	const isCuffed = Player(targetId).state.isCuffed
	if (!isCuffed) {
		notify({ title: 'The person is not weak enough to put in vehicle' })
		return
	}

	for (let seat = 0; seat <= GetVehicleMaxNumberOfPassengers(closestVehicle); seat++) {
		if (!IsVehicleSeatFree(closestVehicle, seat)) continue
		emitNet('lenix:server:interactions:setInVehicle', targetId, NetworkGetNetworkIdFromEntity(closestVehicle), seat)
		break
	}
})

on('lenix:client:interactions:takeOutVehicle', () => {
	const coords = GetPlayer().getCoords() as Vec3
	const [closestCoords, closestVehicle] = getNearestVehicle(coords)
	if (!closestCoords || !closestVehicle) {
		notify({ title: 'No nearby vehicle found!' })
		return
	}
	for (let seat = -1; seat <= GetVehicleMaxNumberOfPassengers(closestVehicle); seat++) {
		const ped = GetPedInVehicleSeat(closestVehicle, seat)
		if (!ped) continue

		emitNet(
			'lenix:server:interactions:setOutVehicle',
			GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)),
			NetworkGetNetworkIdFromEntity(closestVehicle),
			seat,
		)
		return
	}
	notify({ title: 'The vehicle has no one in' })
})


on('lenix:client:interactions:escort', () => {
	const nearest = getNearest.player(GetEntityCoords(cache.ped, false) as Vec3, 2.0, false)
	if (!nearest.playerId) {
		notify({ title: 'No one nearby!' })
		return
	}
	const targetId = GetPlayerServerId(nearest.playerId)
	const isCuffed = Player(targetId).state.isCuffed
	if (!isCuffed) {
		notify({ title: 'The person is not weak enough to get cuffed' })
		return
	}
	emitNet('lenix:server:interactions:escort', targetId)
})

onNet('lenix:client:interaction:getEscorted', (serverId: number, state: boolean) => {
	state ? AttachEntityToEntity(
		cache.ped,
		player.entity(player.id(serverId)),
		11816,
		0.45,
		0.45,
		0.0,
		0.0,
		0.0,
		0.0,
		false,
		false,
		false,
		false,
		2,
		true,
	) : DetachEntity(cache.ped, true, false)
})

on('lenix:client:interactions:cuff', () => {
	const nearest = getNearest.player(entity.coords(player.entity(), true))
	if (!nearest.playerId) {
		notify({
			title: 'No one nearby!',
		})
		return
	}
	emitNet('lenix:server:interactions:cuff', GetPlayerServerId(nearest.playerId))
	cuffingAnimation()
})

onNet('lenix:client:interactions:getCuffed', async (cuffer: number, state: boolean) => {
	isCuffed = state
	disableRadial(state)
	api.ox_target?.disableTargeting?.(state)
	if (state) {
		gettingCuffedAnimation(cuffer)
		const res = await skillCheck('easy')
		if (!res) {
			notify({ title: 'Failed' })
			return
		}

		emitNet('lenix:server:interactions:cuff', cache.serverId)
	} else {
		ClearPedTasks(cache.ped)
		entity.stopAnim(cache.ped, 'mp_arresting')
	}
})

pool(setCuffs)
