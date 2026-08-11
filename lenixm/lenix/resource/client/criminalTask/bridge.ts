import { checkDependency, progressBar } from "@overextended/ox_lib/client"
import { CRIMINIL_TASK } from "common/config"
import type { Vec3 } from "lenix"
import { api } from "lenix/client"

checkDependency('ox_target', '1.18.1', true)

const config = CRIMINIL_TASK

const progress = (label: string) => progressBar({
	duration: 1000,
	label: label,
	useWhileDead: false,
	canCancel: true,
	disable: {
		move: true,
		car: true,
		combat: true
	},
})

const addLocalEntity = (
	prop: number,
	target: typeof config['settings']['task']['target'],
	takeThePackage: () => void
) => api.ox_target?.addLocalEntity?.(prop, [
	{
		name: prop,
		icon: target.icon,
		label: target.label,
		distance: target.distance,
		onSelect: takeThePackage
	}
])

const addBoxZone = ({
	pedCoords, takeTask, isPlayerFree, abortTask
}: {
	pedCoords: Vec3
	takeTask: () => void
	isPlayerFree: boolean
	abortTask: () => void
}) => api.ox_target?.addBoxZone?.({
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
	]
})

const removeLocalEntity = (prop: number) => api.ox_target?.removeLocalEntity?.(prop, prop)

export const bridge = {
	progress,
	addLocalEntity,
	addBoxZone,
	removeLocalEntity,
}