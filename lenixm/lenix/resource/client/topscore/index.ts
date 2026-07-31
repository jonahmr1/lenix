import { triggerServerCallback } from "@overextended/ox_lib/client";
import type { Vec4 } from "lenix";
import { emitEvent } from "lenix/client";
import type { Events } from "types/index";

const screenResolution = GetActiveScreenResolution()
const screenWidth = screenResolution[0] ?? 1920
const screenHeight = screenResolution[1] ?? 1080
const minScale = 0.42
const maxScale = 1
const maxDistance = 35

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

function updateTopscoreCoords(coords: Vec4) {
	const [x, y, z] = coords
	const [visible, screenX, screenY] = GetScreenCoordFromWorldCoord(x, y, z + 1.15)

	if (!visible) {
		emitEvent<Events['updateTopscoreCoords']>('topscore:updateCoords', {
			scale: minScale,
			bottom: -9999,
			left: -9999,
		})
		return
	}

	const playerCoords = GetEntityCoords(PlayerPedId(), false)
	const playerX = playerCoords[0] ?? 0
	const playerY = playerCoords[1] ?? 0
	const playerZ = playerCoords[2] ?? 0
	const distance = GetDistanceBetweenCoords(playerX, playerY, playerZ, x, y, z, true)
	const scale = clamp(1 - distance / maxDistance, minScale, maxScale)

	emitEvent<Events['updateTopscoreCoords']>('topscore:updateCoords', {
		scale,
		bottom: screenY * screenHeight,
		left: screenX * screenWidth,
	})
}

setImmediate(async () => {
	await triggerServerCallback('lenix:server:topscore:getData', null)
	const coords: Vec4 = [-262.79, -964.18, 30.22, 181.71]

	setTick(() => updateTopscoreCoords(coords))
})
