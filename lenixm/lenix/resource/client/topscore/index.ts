import { triggerServerCallback } from "@overextended/ox_lib/client";
import { emitEvent } from "lenix/client";
import type { Events, TopscoreData } from "types/index";

const screenResolution = GetActiveScreenResolution()
const screenWidth = screenResolution[0] ?? 1920
const screenHeight = screenResolution[1] ?? 1080
const minScale: number = 1.22
const maxScale = 3
const maxDistance = 5
const coords = {
	1: [-262.79, -964.18, 30.22],
	2: [-262.79, -964.18, 30.22],
	3: [-262.79, -964.18, 30.22],
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

setInterval(async () => {
	const data = await triggerServerCallback<TopscoreData[]>('lenix:server:topscore:getData', 60_000)
	if (!data) throw data

	setTick(() => data.forEach(data => {
		const [x, y, z] = coords
		const [visible, screenX, screenY] = GetScreenCoordFromWorldCoord(x, y, z + 2.0)
	
		const playerCoords = GetEntityCoords(PlayerPedId(), false)
		const playerX = playerCoords[0] ?? 0
		const playerY = playerCoords[1] ?? 0
		const playerZ = playerCoords[2] ?? 0
		const distance = GetDistanceBetweenCoords(playerX, playerY, playerZ, x, y, z, true)
	
		const
			bottom = screenHeight - screenY * screenHeight,
			left = screenX * screenWidth
		if (!visible || distance > maxDistance) {
			emitEvent<Events['updateTopscoreData']>('topscore:updateData', {
				scale: minScale,
				bottom,
				left,
				visible: false
			})
			return
		}
	
		const scale = clamp(1 - distance / maxDistance, minScale, maxScale)
	
		emitEvent<Events['updateTopscoreData']>('topscore:updateData', {
			scale,
			bottom,
			left,
			visible: true
		})
	}))
}, 60_000)
