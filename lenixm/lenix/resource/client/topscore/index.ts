import { entries } from '@lenix/lenix'
import { checkDependency, createPed, triggerServerCallback } from '@overextended/ox_lib/client'
import type { Vec3, Vec4 } from 'lenix'
import { emitNui, entity, player, pool } from 'lenix/client'
import type { Events, TopscoreContextData, TopscoreData } from 'types/index'

checkDependency('ox_lib', '3.39.0', true)

const screenResolution = GetActiveScreenResolution()
const screenWidth = screenResolution[0] ?? 1920
const screenHeight = screenResolution[1] ?? 1080
const minScale: number = 1.22
const maxScale = 3
const maxDistance = 5
const pedCoords = [
	[3610.4739, 3718.8015, 28.6894, 323.2233],
	[3612.9465, 3717.4700, 28.6894, 8.9750],
	[3607.6973, 3721.4082, 28.6894, 267.9889],
] as const
const coords: Record<keyof TopscoreContextData, Vec3> = {
	1: [pedCoords[0][0], pedCoords[0][1], pedCoords[0][2]],
	2: [pedCoords[1][0], pedCoords[1][1], pedCoords[1][2]],
	3: [pedCoords[2][0], pedCoords[2][1], pedCoords[2][2]],
}
const refreshInterval = 60_000

let players: TopscoreContextData | undefined

const getData = async () => {
	const data = await triggerServerCallback<TopscoreContextData>('lenix:server:topscore:getData', refreshInterval)
	players = data ?? {
		'1': {
			name: 'Lenix',
			avatar: 'https://lenix.dev/icon.png',
			stats: {
				kills: 10,
				deaths: 5,
				wins: 3,
				kd: 2,
			},
		},
		'2': {
			name: 'Lenix',
			avatar: 'https://lenix.dev/icon.png',
			stats: {
				kills: 10,
				deaths: 5,
				wins: 3,
				kd: 2,
			},
		},
		'3': {
			name: 'Lenix',
			avatar: 'https://lenix.dev/icon.png',
			stats: {
				kills: 10,
				deaths: 5,
				wins: 3,
				kd: 2,
			},
		},
	}
}

setImmediate(async () => {
	await getData()
	for (const coords of pedCoords) createPed('a_m_m_prolhost_01', ...coords as Vec4)
})
setInterval(getData, refreshInterval)
pool(() => {
	if (!players) return

	const playerCoords = entity.coords(player.entity(), true)

	emitNui<Events['updateTopscoreData']>(
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
						scale:
							visible && distance <= maxDistance
								? Math.min(Math.max(1 - distance / maxDistance, minScale), maxScale)
								: minScale,
						visible: visible && distance <= maxDistance,
					},
				]
			}),
		) as TopscoreData,
	)
})
