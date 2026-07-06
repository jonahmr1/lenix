import { cache, progressBar, registerContext, showContext } from "@overextended/ox_lib/client"
import { FIRST_FLOOR_INDEX, FIRST_ROOMS_FLOOR_INDEX, HOTEL_FLOORS } from "common/hotel"
import type { Vector3, Vector4 } from "types/index"

const COMMANDER_ROTATION = 70
const WAIT_DURATION = 5

const ELEVATORS: Record<number, Vector4> = {
	['0']: [-350.8350, -1042.4888, 29.3840, 250.4242],
	['1']: [-350.8350, -1042.4888, 36.3840, 250.4242],
	['4']: [-350.8350, -1042.4888, 45.3840, 250.4242],
	['5']: [-350.8350, -1042.4888, 49.3840, 250.4242],
	['6']: [-350.8350, -1042.4888, 53.3840, 250.4242],
	['7']: [-350.8350, -1042.4888, 57.3840, 250.4242],
	['8']: [-350.8350, -1042.4888, 61.3840, 250.4242],
	['9']: [-350.8350, -1042.4888, 65.3840, 250.4242],
	['10']: [-350.8350, -1042.4888, 69.3840, 250.4242],
	['11']: [-350.8350, -1042.4888, 73.3840, 250.4242],
	['12']: [-350.8350, -1042.4888, 77.3840, 250.4242],
	['13']: [-350.8350, -1042.4888, 81.3840, 250.4242],
	['14']: [-350.8350, -1042.4888, 85.3840, 250.4242],
	['15']: [-350.8350, -1042.4888, 89.3840, 250.4242],
	['16']: [-350.8350, -1042.4888, 93.3840, 250.4242],
	['17']: [-350.8350, -1042.4888, 97.3840, 250.4242],
	['18']: [-350.8350, -1042.4888, 101.3840, 250.4242],
	['19']: [-350.8350, -1042.4888, 105.3840, 250.4242],
	['20']: [-350.8350, -1042.4888, 109.3840, 250.4242],
	['21']: [-350.8350, -1042.4888, 123.3840, 250.4242],
	['22']: [-350.8350, -1042.4888, 117.3840, 250.4242],
	['23']: [-350.8350, -1042.4888, 121.3840, 250.4242],
	['24']: [-350.8350, -1042.4888, 125.3840, 250.4242],
	['25']: [-350.8350, -1042.4888, 129.3840, 250.4242],
	['26']: [-350.8350, -1042.4888, 133.3840, 250.4242],
	['27']: [-350.8350, -1042.4888, 137.3840, 250.4242],
	['28']: [-350.8350, -1042.4888, 141.3840, 250.4242],
}

for (const [floor, coords] of Object.entries(ELEVATORS)) {
	registerContext({
		id: `elevator-${floor}`,
		title: 'Elevator',
		options: [
			...Object.entries(ELEVATORS).map(([floor, coords]) => ({
				title: `Floor ${floor}`,
				onSelect: async () => {
					await progressBar({
						label: 'Calling the elevator...',
						duration: WAIT_DURATION * 1000
					})
					const entityCoords = GetEntityCoords(cache.ped, true) as Vector3
					const heading = GetEntityHeading(cache.ped)
					SetEntityCoords(cache.ped, entityCoords[0], entityCoords[1], coords[2], false, false, false, false)
					SetEntityHeading(cache.ped, heading)
				}
			}))
		],
	});
	globalThis.exports.ox_target.addBoxZone({
		coords,
		size: [0.3, 0.3, 0.8],
		rotation: COMMANDER_ROTATION,
		options: [{
			label: `Use Elevator ${floor}`,
			onSelect: () => {
				showContext(`elevator-${floor}`)
			}
		}]
	})
}