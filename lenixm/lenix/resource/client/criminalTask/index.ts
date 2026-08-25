import { asserts, random } from '@lenix/lenix'
import {
	createPed as oxCreatePed,
	notify,
	requestAnimDict,
	requestModel,
	triggerServerCallback,
	checkDependency,
	progressBar,
} from '@overextended/ox_lib/client'
import { CRIMINIL_TASK } from 'common/config'
import type { Vec3, Vec4 } from 'lenix'
import { api, blip, client } from 'lenix/client'
import type { CriminialApi } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)

const config = CRIMINIL_TASK
let isPlayerFree = true
let waypoint: number, prop: number | null

const setPlayerStatus = (state: boolean) => (isPlayerFree = state)

const randomInteractCoords = (): Vec3 => {
	const index = random(1, config.taskCoords.length)
	const coords = config.taskCoords[index]
	asserts(coords)
	return coords
}

const createWayPoint = () => {
	const coords = randomInteractCoords()

	waypoint = blip.create({
		coords,
		icon: config.settings.blipWaypoint.sprite,
	})
	SetBlipColour(waypoint, config.settings.blipWaypoint.color.blip)
	SetBlipScale(waypoint, config.settings.blipWaypoint.scale)
	BeginTextCommandSetBlipName('STRING')
	AddTextComponentString(config.settings.blipWaypoint.label)
	EndTextCommandSetBlipName(waypoint)

	SetBlipRoute(waypoint, true)
	SetBlipRouteColour(waypoint, config.settings.blipWaypoint.color.route)
	return coords
}

const createPackage = async (coords: Vec3) => {
	const task = config.settings.task
	const model = task.propModel
	const target = task.target
	await requestModel(model)

	prop = CreateObject(GetHashKey(model), coords[0], coords[1], coords[2], true, true, false)
	SetEntityHeading(prop, 0.0)
	PlaceObjectOnGroundProperly(prop)
	SetEntityAsMissionEntity(prop, true, true)

	api.ox_target?.addLocalEntity?.(prop, [
		{
			name: prop,
			icon: target.icon,
			label: target.label,
			distance: target.distance,
			onSelect: takeThePackage,
		},
	])
	return prop
}

const takeTask = async () => {
	isPlayerFree = false
	const coords = createWayPoint()
	prop = await createPackage(coords)
	notify({
		title: 'Success',
		description: config.settings.task.notify.take,
		type: 'success',
	})
}

const abortTask = () => {
	isPlayerFree = true
	if (waypoint) RemoveBlip(waypoint)
	notify({
		title: 'Error',
		description: config.settings.task.notify.abort,
		type: 'error',
	})
	if (prop) {
		DeleteEntity(prop)
		api.ox_target?.removeLocalEntity?.(prop, prop)
	}
	prop = null
}

const takeThePackage = async () => {
	const locale = config.settings.task.notify
	const playerPed = PlayerPedId()
	const dict = 'pickup_object'

	await requestAnimDict(dict)

	client.entity.playAnim(playerPed, dict, 'pickup_low', 1.5, 1.5, 1000, 49, 0, false, false, false)

	if (await progressBar({
		duration: 1000,
		label: locale.progressBar,
		useWhileDead: false,
		canCancel: true,
		disable: {
			move: true,
			car: true,
			combat: true,
		},
	})) {
		client.entity.stopAnim(playerPed, dict)
		const re = await triggerServerCallback<CriminialApi>('lenix_criminiltasks:server:receiveItem', null)
		asserts(re)
		const { success, response, item, error } = re

		if (!success || !success) {
			notify({
				title: 'Error',
				description: `Something went wrong, Could not give item: ${(response && error) || 'Unknown'}`,
				type: 'error',
			})
			return
		}

		asserts(success == true, `Failed to give ${item}, the reason: ${response}`)
		asserts(prop)

		DeleteEntity(prop)
		notify({
			title: locale.title,
			description: locale.success,
			type: 'success',
		})
		isPlayerFree = true
		blip.destroy(waypoint)
	} else {
		client.entity.stopAnim(playerPed, dict)
		notify({
			title: locale.canceled,
			description: locale.description,
			type: 'error',
		})
	}
}

const createPed = async (pedModel: string, pedCoords: Vec4, pedScenario: unknown) => {
	await requestModel(pedModel)

	const pedHandle = oxCreatePed(pedModel, pedCoords[0], pedCoords[1], pedCoords[2] - 0.85, pedCoords[3])
	// behavior = {
	//   freeze = true,
	//   oblivious = true
	// },
	// scenario = {
	//   name = pedScenario,
	//   timeToLeave = 0,
	//   playIntroClip = true
	// }

	return pedHandle
}

setImmediate(() => {
	for (const data of config.peds) {
		const pedCoords = data.coords
		createPed(data.model, pedCoords, data.scenario)
		api.ox_target?.addBoxZone?.({
			coords: [pedCoords[0], pedCoords[1], pedCoords[2]],
			size: [1, 1, 2],
			debug: false,
			options: [
				{
					label: config.settings.ped.take.targetLabel,
					icon: config.settings.ped.take.targetIcon,
					onSelect: takeTask,
					canInteract: () => isPlayerFree,
					distance: config.settings.ped.take.distance,
				},
				{
					label: config.settings.ped.abort.targetLabel,
					icon: config.settings.ped.abort.targetIcon,
					onSelect: abortTask,
					canInteract: () => !isPlayerFree,
					distance: config.settings.ped.abort.distance,
				},
			],
		})
	}
})

on('onResourceStop', (resourceName: string) => {
	if (resourceName !== GetCurrentResourceName()) return

	if (isPlayerFree) return
	abortTask()
	setPlayerStatus(false)
})
