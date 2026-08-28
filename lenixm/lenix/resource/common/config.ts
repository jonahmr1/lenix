import { LoadFile } from './utils'
import type { Vector3 } from 'types/index'
import type { Vector4 } from 'types'
import type { Vec3, Vec4 } from 'lenix'

const Config = LoadFile('public/config.json')
export default Config

export const MAX_CALLSIGN_LENGTH = 6

export const VEHICLE_MODEL: string = 'stockade'
export const MISSION_PRICE = 2000

export const INSIDE_COORDS: Vector3 = [1680.1442, 2512.8276, 45.5648]
interface Safe {
	coords: Vector4
	rotation: number
}

const ROOM_FLOORS_AMOUNT: number = 25
const ROOMS_PER_FLOOR: number = 18
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

const HOTEL_ROOM_FLOORS: number[] = Array.from({ length: ROOM_FLOORS_AMOUNT }, (_, i) => i + FIRST_ROOMS_FLOOR_INDEX)

export const FLOOR_HEIGHT: number = 4
export const FIRST_ROOMS_FLOOR_INDEX: number = 4

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

export const DEFAULT_KEY = 'N'
export const AUTHORIZED_JOBS: string[] | null = null
export const VEHICLE_TIERS = {
	S: ['police'],
	A: ['police2'],
	B: ['police3'],
	C: ['police4'],
}

export const VEHICLE_MODES = ['N', 'S', 'S+', 'R'] as const

export const VEHICLE_MODS = {
	N: {
		Turbo: false,
		Engine: -1,
		Brakes: 0,
		Transmission: -1,
	},
	S: {
		Turbo: false,
		Engine: 1,
		Brakes: 1,
		Transmission: 1,
	},
	['S+']: {
		Turbo: true,
		Engine: 2,
		Brakes: 2,
		Transmission: 2,
	},
	R: {
		Turbo: true,
		Engine: 3,
		Brakes: 2,
		Transmission: 2,
	},
}

export const TIER_CONFIG = {
	C: {
		N: {
			fDriveInertia: 1.0,
			fBrakeForce: 0.75,
			fInitialDriveMaxFlatVel: 135.0,
			fSteeringLock: 42.0,
			fInitialDriveForce: 0.26,
		},
		S: {
			fDriveInertia: 1.05,
			fBrakeForce: 0.8,
			fInitialDriveMaxFlatVel: 145.0,
			fSteeringLock: 40.0,
			fInitialDriveForce: 0.28,
		},
		['S+']: {
			fDriveInertia: 1.1,
			fBrakeForce: 0.85,
			fInitialDriveMaxFlatVel: 155.0,
			fSteeringLock: 38.0,
			fInitialDriveForce: 0.3,
		},
		R: {
			fDriveInertia: 1.15,
			fBrakeForce: 0.9,
			fInitialDriveMaxFlatVel: 165.0,
			fSteeringLock: 36.0,
			fInitialDriveForce: 0.35,
		},
	},
	B: {
		N: {
			fDriveInertia: 1.0,
			fBrakeForce: 0.8,
			fInitialDriveMaxFlatVel: 145.0,
			fSteeringLock: 40.0,
			fInitialDriveForce: 0.28,
		},
		S: {
			fDriveInertia: 1.08,
			fBrakeForce: 0.85,
			fInitialDriveMaxFlatVel: 155.0,
			fSteeringLock: 38.0,
			fInitialDriveForce: 0.31,
		},
		['S+']: {
			fDriveInertia: 1.13,
			fBrakeForce: 0.9,
			fInitialDriveMaxFlatVel: 165.0,
			fSteeringLock: 36.0,
			fInitialDriveForce: 0.34,
		},
		R: {
			fDriveInertia: 1.18,
			fBrakeForce: 0.95,
			fInitialDriveMaxFlatVel: 175.0,
			fSteeringLock: 34.0,
			fInitialDriveForce: 0.38,
		},
	},
	A: {
		N: {
			fDriveInertia: 1.0,
			fBrakeForce: 0.85,
			fInitialDriveMaxFlatVel: 155.0,
			fSteeringLock: 38.0,
			fInitialDriveForce: 0.3,
		},
		S: {
			fDriveInertia: 1.1,
			fBrakeForce: 0.9,
			fInitialDriveMaxFlatVel: 165.0,
			fSteeringLock: 36.0,
			fInitialDriveForce: 0.33,
		},
		['S+']: {
			fDriveInertia: 1.16,
			fBrakeForce: 0.95,
			fInitialDriveMaxFlatVel: 175.0,
			fSteeringLock: 34.0,
			fInitialDriveForce: 0.37,
		},
		R: {
			fDriveInertia: 1.22,
			fBrakeForce: 1.0,
			fInitialDriveMaxFlatVel: 185.0,
			fSteeringLock: 32.0,
			fInitialDriveForce: 0.42,
		},
	},
	S: {
		N: {
			fDriveInertia: 1.0,
			fBrakeForce: 0.9,
			fInitialDriveMaxFlatVel: 165.0,
			fSteeringLock: 36.0,
			fInitialDriveForce: 0.32,
		},
		S: {
			fDriveInertia: 1.12,
			fBrakeForce: 0.95,
			fInitialDriveMaxFlatVel: 175.0,
			fSteeringLock: 34.0,
			fInitialDriveForce: 0.36,
		},
		['S+']: {
			fDriveInertia: 1.2,
			fBrakeForce: 1.0,
			fInitialDriveMaxFlatVel: 185.0,
			fSteeringLock: 32.0,
			fInitialDriveForce: 0.41,
		},
		R: {
			fDriveInertia: 1.28,
			fBrakeForce: 1.1,
			fInitialDriveMaxFlatVel: 195.0,
			fSteeringLock: 30.0,
			fInitialDriveForce: 0.48,
		},
	},
}

export const MEGAPHONE = {
	range: 30.0,
	command: 'togglemic',
	key: 'K',
	description: "Toggle Patrol's Mic",
	locales: {
		on: 'Activated',
		off: 'Deactivated',
		left: 'You left the emergency vehicle, mic turned off!',
		refused: 'You must be in an emergency vehicle to use the patrol mic!',
		unavailable: 'Patrol mic is not available right now!',
	},
	vehicleClass: [18],
	vehicleModels: ['ambulance', 'firetruck', 'police', 'police2', 'police3'],
} as const
