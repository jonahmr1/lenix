import { entries } from "@lenix/lenix";
import { triggerServerCallback } from "@overextended/ox_lib/client";
import type { Vec3 } from "lenix";
import { client, emitEvent } from "lenix/client";
import type { Events, TopscoreContextData, TopscoreData } from "types/index";

const screenResolution = GetActiveScreenResolution()
const screenWidth = screenResolution[0] ?? 1920
const screenHeight = screenResolution[1] ?? 1080
const minScale: number = 1.22
const maxScale = 3
const maxDistance = 5
const coords: Record<1 | 2 | 3, Vec3> = {
	1: [-262.79, -964.18, 30.22],
	2: [-262.79, -964.18, 30.22],
	3: [-262.79, -964.18, 30.22],
}

setInterval(async () => {
	const players = await triggerServerCallback<TopscoreContextData>('lenix:server:topscore:getData', 60_000)
	if (!players) throw players

	setTick(() => {
		const [visible, screenX, screenY] = GetScreenCoordFromWorldCoord(x, y, z + 2.0)
	
		const playerCoords = client.player.coords()
		const distance = GetDistanceBetweenCoords(...playerCoords, x, y, z, true)
	
		const
			bottom = screenHeight - screenY * screenHeight,
			left = screenX * screenWidth
		if (!visible || distance > maxDistance) {
			emitEvent<Events['updateTopscoreData']>(
				'topscore:updateData',
				Object.fromEntries(
					entries(players).map(([rank, data]) => [
						rank,
						{
							...data,
							bottom,
							left,
							scale: minScale,
							visible: false,
						},
					])
				) as TopscoreData
			)
			return
		}
	
		emitEvent<Events['updateTopscoreData']>(
			'topscore:updateData',
			Object.fromEntries(
				entries(players).map(([rank, data]) => [
					rank,
					{
						...data,
						left,
						bottom,
						scale: Math.min(Math.max(1 - distance / maxDistance, minScale), maxScale),
						visible: true,
					},
				])
			) as TopscoreData
		)
	})
}, 60_000)
