import { LoadFile } from "./utils";
import type { Vector3 } from 'types/index'
import type { Vector4 } from 'types'
import type { Vec3, Vec4 } from "lenix";

const Config = LoadFile("public/config.json");
export default Config;

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

const HOTEL_ROOM_FLOORS: number[] = Array.from(
	{ length: ROOM_FLOORS_AMOUNT },
	(_, i) => i + FIRST_ROOMS_FLOOR_INDEX,
)

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

export const CRIMINIL_TASK: {
	settings: {
		ped: {
			take: {
				targetLabel: string;
				targetIcon: string;
				distance: number;
			};
			abort: {
				targetLabel: string;
				targetIcon: string;
				distance: number;
			};
		};
		task: {
			notify: {
				take: string;
				abort: string;
				progressBar: string;
				title: string;
				success: string;
				canceled: string;
				description: string;
			};
			target: {
				label: string;
				icon: string;
				distance: number;
			};
			propModel: string;
		};
		blipWaypoint: {
			sprite: number;
			color: {
				route: number;
				blip: number;
			};
			scale: number;
			label: string;
		};
	};
	taskCoords: Vec3[];
	peds: {
		model: string;
		scenario: string;
		coords: Vec4;
	}[];
	items: {
		[key: string]: {
			percentage: number;
			amount: number;
		};
	};
} = {
	settings: {
		ped: {
			take: {
				targetLabel: 'Take a task',
				targetIcon: 'fa-solid fa-circle',
				distance: 1.0
			},
			abort: {
				targetLabel: 'Abort the task',
				targetIcon: 'fa-solid fa-xmark',
				distance: 1.0
			}
		},
		task: {
			notify: {
				take: 'I have setted a waypoint for you in the map',
				abort: 'Task Aborted',
				progressBar: 'Picking up package...',
				title: 'Delivery',
				success: 'You picked up the package!',
				canceled: 'Canceled',
				description: 'You canceled picking up the package.'
			},
			target: {
				label: 'Open the box',
				icon: 'fa-solid fa-box',
				distance: 1.5
			},
			propModel: 'prop_cs_package_01'
		},
		blipWaypoint: {
			sprite: 543,
			color: {
				route: 1,
				blip: 1
			},
			scale: 0.9,
			label: 'Anonymous'
		}
	},
	taskCoords: [
		[522.43, 198.49, 107.31],
		[584.08, 138.19, 98.47],
		[971.46, -95.89, 74.31],
		[1192.5, -1249.22, 39.32],
		[814.02, -491.28, 30.52],
		[1221.41, 333.76, 82.11],
		[-1363.22, 362.93, 63.76],
		[-1792.98, 158.06, 66.58],
		[-1286.53, 4497.34, 14.74],
		[-1632.98, 4735.9, 52.31],
		[10.38, 3736.92, 39.52],
		[-164.93, 6139.83, 31.21],
		[-86.79, 6368.98, 32.38],
		[-105.77, 6528.71, 29.17],
		[1700.97, 4868.5, 41.85],
		[2016.15, 4986.96, 41.1],
	],
	peds: [
		{
			model: 'g_m_importexport_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-2213.64, -371.48, 13.32, 39.33],
		},
		{
			model: 'g_m_m_armboss_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1075.89, -2358.9, 30.28, 261.78],
		},
		{
			model: 'g_m_y_ballaeast_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [545.97, -2690.91, 6.22, 3.52],
		},
		{
			model: 'g_m_y_ballaorig_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1459.76, 1043.43, 112.33, 272.81],
		},
		{
			model: 'g_m_y_ballasout_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-1844.91, 223.29, 84.44, 308.06],
		},
		{
			model: 'g_m_y_lost_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [793.74, 537.9, 126.11, 142.59],
		},
		{
			model: 'g_m_y_mexgoon_03',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [1661.04, -26.0, 17377, 116.52],
		},
		{
			model: 'g_m_y_salvaboss_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-957.23, -1566.86, 5.02, 106.8],
		},
		{
			model: 'g_m_y_mexgoon_02',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [164.83, 2226.22, 90.87, 51.62],
		},
		{
			model: 'g_m_y_armgoon_02',
			scenario: 'WORLD_HUMAN_STAND_FISHING',
			coords: [713.28, 4092.59, 35.73, 179.51],
		},
		{
			model: 'g_m_y_korean_02',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [-2165.67, 5196.09, 16.88, 58.42],
		},
		{
			model: 'g_m_m_chicold_01',
			scenario: 'WORLD_HUMAN_LEANING',
			coords: [445.96, 6463.31, 28.78, 54.34],
		},
	],
	items: {
		['itemName']: {
			percentage: 0,
			amount: 0
		},
	}
}

export const DEFAULT_KEY = 'N'
export const AUTHORIZED_JOBS: string[] | null = null
export const VEHICLE_TIERS = {
	S: ['police',],
	A: ['police2',],
	B: ['police3',],
	C: ['police4',],
}

export const VEHICLE_MODES = ["N", "S", "S+", "R"] as const

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
	["S+"]: {
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
	}
}

export const TIER_CONFIG = {
	C: {
		N: {
			fDriveInertia: 1.000000,
			fBrakeForce: 0.750,
			fInitialDriveMaxFlatVel: 135.000000,
			fSteeringLock: 42.00,
			fInitialDriveForce: 0.260
		},
		S: {
			fDriveInertia: 1.050000,
			fBrakeForce: 0.800,
			fInitialDriveMaxFlatVel: 145.000000,
			fSteeringLock: 40.00,
			fInitialDriveForce: 0.280
		},
		['S+']: {
			fDriveInertia: 1.100000,
			fBrakeForce: 0.850,
			fInitialDriveMaxFlatVel: 155.000000,
			fSteeringLock: 38.00,
			fInitialDriveForce: 0.300
		},
		R: {
			fDriveInertia: 1.150000,
			fBrakeForce: 0.900,
			fInitialDriveMaxFlatVel: 165.000000,
			fSteeringLock: 36.00,
			fInitialDriveForce: 0.350
		}
	},
	B: {
		N: {
			fDriveInertia: 1.000000,
			fBrakeForce: 0.800,
			fInitialDriveMaxFlatVel: 145.000000,
			fSteeringLock: 40.00,
			fInitialDriveForce: 0.280
		},
		S: {
			fDriveInertia: 1.080000,
			fBrakeForce: 0.850,
			fInitialDriveMaxFlatVel: 155.000000,
			fSteeringLock: 38.00,
			fInitialDriveForce: 0.310
		},
		['S+']: {
			fDriveInertia: 1.130000,
			fBrakeForce: 0.900,
			fInitialDriveMaxFlatVel: 165.000000,
			fSteeringLock: 36.00,
			fInitialDriveForce: 0.340
		},
		R: {
			fDriveInertia: 1.180000,
			fBrakeForce: 0.950,
			fInitialDriveMaxFlatVel: 175.000000,
			fSteeringLock: 34.00,
			fInitialDriveForce: 0.380
		}
	},
	A: {
		N: {
			fDriveInertia: 1.000000,
			fBrakeForce: 0.850,
			fInitialDriveMaxFlatVel: 155.000000,
			fSteeringLock: 38.00,
			fInitialDriveForce: 0.300
		},
		S: {
			fDriveInertia: 1.100000,
			fBrakeForce: 0.900,
			fInitialDriveMaxFlatVel: 165.000000,
			fSteeringLock: 36.00,
			fInitialDriveForce: 0.330
		},
		['S+']: {
			fDriveInertia: 1.160000,
			fBrakeForce: 0.950,
			fInitialDriveMaxFlatVel: 175.000000,
			fSteeringLock: 34.00,
			fInitialDriveForce: 0.370
		},
		R: {
			fDriveInertia: 1.220000,
			fBrakeForce: 1.000,
			fInitialDriveMaxFlatVel: 185.000000,
			fSteeringLock: 32.00,
			fInitialDriveForce: 0.420
		}
	},
	S: {
		N: {
			fDriveInertia: 1.000000,
			fBrakeForce: 0.900,
			fInitialDriveMaxFlatVel: 165.000000,
			fSteeringLock: 36.00,
			fInitialDriveForce: 0.320
		},
		S: {
			fDriveInertia: 1.120000,
			fBrakeForce: 0.950,
			fInitialDriveMaxFlatVel: 175.000000,
			fSteeringLock: 34.00,
			fInitialDriveForce: 0.360
		},
		['S+']: {
			fDriveInertia: 1.200000,
			fBrakeForce: 1.000,
			fInitialDriveMaxFlatVel: 185.000000,
			fSteeringLock: 32.00,
			fInitialDriveForce: 0.410
		},
		R: {
			fDriveInertia: 1.280000,
			fBrakeForce: 1.100,
			fInitialDriveMaxFlatVel: 195.000000,
			fSteeringLock: 30.00,
			fInitialDriveForce: 0.480
		}
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
	vehicleModels: ['ambulance', 'firetruck', 'police', 'police2', 'police3']
}