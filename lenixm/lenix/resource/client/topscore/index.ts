import { entries } from "@lenix/lenix";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import type { Vec3 } from "lenix";
import { client, emitEvent, pool } from "lenix/client";
import type { Events, TopscoreContextData, TopscoreData } from "types/index";

const screenResolution = GetActiveScreenResolution()
const screenWidth = screenResolution[0] ?? 1920
const screenHeight = screenResolution[1] ?? 1080
const minScale: number = 1.22
const maxScale = 3
const maxDistance = 5
const coords: Record<keyof TopscoreContextData, Vec3> = {
	1: [902.8286, -2108.0896, 30.4594],
	2: [904.6212, -2108.2192, 30.4594],
	3: [901.0425, -2107.9170, 30.4594],
}

let players: TopscoreContextData | undefined | void

const getData = async () => players = await triggerServerCallback<TopscoreContextData>('lenix:server:topscore:getData', 60_000)

setImmediate(async () => {
	getData()
})

setInterval(async () => {
	getData()
}, 60_000)

pool(() => {
	if (!players) return

	const playerCoords = client.player.coords(true)

	emitEvent<Events['updateTopscoreData']>(
		'topscore:updateData',
		Object.fromEntries(
			entries(players).map(([rank, data]) => {
				const [x, y, z] = coords[rank]
				const [visible, screenX, screenY] = GetScreenCoordFromWorldCoord(x, y, z + 2.0)
				const distance = GetDistanceBetweenCoords(...playerCoords, x, y, z, true)

				const bottom = screenHeight - screenY * screenHeight
				const left = screenX * screenWidth

				return [
					rank,
					{
						...data,
						bottom,
						left,
						scale: visible && distance <= maxDistance
							? Math.min(Math.max(1 - distance / maxDistance, minScale), maxScale)
							: minScale,
						visible: visible && distance <= maxDistance,
					},
				]
			})
		) as TopscoreData
	)
})
