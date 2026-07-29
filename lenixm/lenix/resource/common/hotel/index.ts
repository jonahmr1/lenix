import type { Vector4 } from 'types'

interface Safe {
	coords: Vector4
	rotation: number
}

const FLOORS_AMOUNT: number = 26
const ROOM_FLOORS_AMOUNT: number = 25
export const FLOOR_HEIGHT: number = 4
export const FIRST_ROOMS_FLOOR_INDEX: number = 4
export const ROOMS_PER_FLOOR: number = 18
export const FIRST_FLOOR_INDEX: number = 0
export const STARTER_DEPOSIT = 5000

export const HOTEL_FLOORS: number[] = Array.from({ length: FLOORS_AMOUNT }, (_, i) =>
	i === 0 ? 0 : FIRST_ROOMS_FLOOR_INDEX + i - (FLOORS_AMOUNT - ROOM_FLOORS_AMOUNT),
)
export const HOTEL_ROOM_FLOORS: number[] = Array.from(
	{ length: ROOM_FLOORS_AMOUNT },
	(_, i) => i + FIRST_ROOMS_FLOOR_INDEX,
)

const FIRST_FLOOR_SAFES: readonly Safe[] = [
	{ coords: [-348.0733, -1049.4086, 45.23, 160.1787], rotation: 70.0 },
	{ coords: [-341.6795, -1031.9573, 45.2296, 271.7698], rotation: 70.0 },
	{ coords: [-341.0572, -1054.2097, 45.2272, 261.5746], rotation: 70.0 },
	{ coords: [-333.2138, -1032.5966, 45.2899, 255.0691], rotation: 70.0 },
	{ coords: [-332.8487, -1048.2506, 45.2337, 10.2903], rotation: 70.0 },
	{ coords: [-334.1627, -1058.9235, 45.2948, 256.104], rotation: 70.0 },
	{ coords: [-325.0476, -1033.5397, 45.2264, 271.6854], rotation: 70.0 },
	{ coords: [-325.8711, -1059.1672, 45.2342, 263.1199], rotation: 70.0 },
	{ coords: [-312.2982, -1040.7257, 45.2507, 109.6542], rotation: 70.0 },
	{ coords: [-313.2722, -1066.5492, 45.2938, 82.9694], rotation: 70.0 },
	{ coords: [-303.8553, -1041.5046, 45.2952, 70.0232], rotation: 70.0 },
	{ coords: [-304.6641, -1067.0217, 45.2954, 71.5061], rotation: 70.0 },
	{ coords: [-297.1705, -1045.6885, 45.2954, 86.584], rotation: 70.0 },
	{ coords: [-305.5876, -1051.625, 45.2376, 198.3554], rotation: 70.0 },
	{ coords: [-296.7383, -1068.0686, 45.2264, 86.366], rotation: 70.0 },
	{ coords: [-290.2336, -1050.592, 45.2229, 51.4837], rotation: 70.0 },
	{ coords: [-288.3881, -1068.9478, 45.225, 76.9939], rotation: 70.0 },
	{ coords: [-283.3085, -1054.848, 45.2238, 91.083], rotation: 70.0 },
]

if (FIRST_FLOOR_SAFES.length !== ROOMS_PER_FLOOR)
	throw new Error(`Safes count mismatch, expected ${ROOMS_PER_FLOOR}, got ${FIRST_FLOOR_SAFES.length}`)

export const HOTEL_ROOMS: number[] = Array.from({ length: ROOM_FLOORS_AMOUNT * ROOMS_PER_FLOOR }, (_, i) => {
	const floor = HOTEL_ROOM_FLOORS[Math.floor(i / ROOMS_PER_FLOOR)]

	const room = (i % ROOMS_PER_FLOOR) + 1
	return Number(`${floor}${String(room).padStart(2, '0')}`)
})

export const HOTEL_SAFES: Record<number, Safe> = Object.fromEntries(
	HOTEL_ROOMS.map((room, i) => {
		const floorIndex = Math.floor(i / ROOMS_PER_FLOOR)
		const roomIndex = i % ROOMS_PER_FLOOR
		return [
			room,
			{
				coords: [
					FIRST_FLOOR_SAFES[roomIndex]!.coords[0],
					FIRST_FLOOR_SAFES[roomIndex]!.coords[1],
					FIRST_FLOOR_SAFES[roomIndex]!.coords[2] + FLOOR_HEIGHT * floorIndex,
					FIRST_FLOOR_SAFES[roomIndex]!.coords[3],
				],
				rotation: FIRST_FLOOR_SAFES[roomIndex]!.rotation,
			},
		]
	}),
)

export const getSafeById = (id: number) => `room:${id}`
