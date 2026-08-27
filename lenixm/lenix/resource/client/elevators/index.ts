import { entries } from '@lenix/lenix'
import { checkDependency, progressBar, registerContext, showContext } from '@overextended/ox_lib/client'
import type { Vec4 } from 'lenix'
import { api, entity } from 'lenix/client'
import type { Vector4 } from 'types/index'

checkDependency('ox_target', '1.18.1', true)

const COMMANDER_ROTATION = 70
const WAIT_DURATION = 5

const ELEVATORS = {
	0: [-350.835, -1042.4888, 29.784, 250.4242],
	1: [-350.835, -1042.4888, 36.784, 250.4242],
	4: [-350.835, -1042.4888, 45.784, 250.4242],
	5: [-350.835, -1042.4888, 49.784, 250.4242],
	6: [-350.835, -1042.4888, 53.784, 250.4242],
	7: [-350.835, -1042.4888, 57.784, 250.4242],
	8: [-350.835, -1042.4888, 61.784, 250.4242],
	9: [-350.835, -1042.4888, 65.784, 250.4242],
	10: [-350.835, -1042.4888, 69.784, 250.4242],
	11: [-350.835, -1042.4888, 73.784, 250.4242],
	12: [-350.835, -1042.4888, 77.784, 250.4242],
	13: [-350.835, -1042.4888, 81.784, 250.4242],
	14: [-350.835, -1042.4888, 85.784, 250.4242],
	15: [-350.835, -1042.4888, 89.784, 250.4242],
	16: [-350.835, -1042.4888, 93.784, 250.4242],
	17: [-350.835, -1042.4888, 97.784, 250.4242],
	18: [-350.835, -1042.4888, 101.784, 250.4242],
	19: [-350.835, -1042.4888, 105.784, 250.4242],
	20: [-350.835, -1042.4888, 109.784, 250.4242],
	21: [-350.835, -1042.4888, 113.784, 250.4242],
	22: [-350.835, -1042.4888, 117.784, 250.4242],
	23: [-350.835, -1042.4888, 121.784, 250.4242],
	24: [-350.835, -1042.4888, 125.784, 250.4242],
	25: [-350.835, -1042.4888, 129.784, 250.4242],
	26: [-350.835, -1042.4888, 133.784, 250.4242],
	27: [-350.835, -1042.4888, 137.784, 250.4242],
	28: [-350.835, -1042.4888, 141.784, 250.4242],
} as const satisfies Record<number, Vector4>

const elevate = async (coords: Vec4) => {
	const didntCanceled = await progressBar({
		label: 'Calling the elevator...',
		duration: WAIT_DURATION * 1000,
		canCancel: true,
	})
	if (!didntCanceled) return

	const playerCoords = entity.coords()
	entity.teleport(playerCoords[0], playerCoords[1], coords[2])
}

for (const [floor, coords] of entries(ELEVATORS)) {
	registerContext({
		id: `elevator-${floor}`,
		title: 'Elevator',
		options: [
			...entries(ELEVATORS)
			.filter(([floor_]) => floor_ !== floor)
			.map(([floor_, coords]) => ({
				title: `Floor ${floor_}`,
				onSelect: () => elevate(coords),
			})),
		],
	})
	api.ox_target?.addBoxZone?.({
		coords,
		size: [0.3, 0.3, 0.8],
		rotation: COMMANDER_ROTATION,
		options: [
			{
				label: 'Use Elevator',
				onSelect: () => showContext(`elevator-${floor}`)
			},
		],
	})
}
