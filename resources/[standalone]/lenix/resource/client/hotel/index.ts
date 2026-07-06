import type { Vector4 } from "..";

interface Safe {
	coords: Vector4
	rotation: number
}

export const FLOOR_HEIGHT = 4 as const
export const FIRST_FLOOR_INDEX = 4 as const
export const FLOORS_AMOUNT = 25 as const
const ROOMS_PER_FLOOR = 18 as const
const SAFE_SIZE = [0.66, 0.66, 0.66] as const
const FIRST_FLOOR_SAFES: Safe[] = [
	{ coords: [-348.0733, -1049.4086, 45.2300, 160.1787], rotation: 70.0 },
	{ coords: [-341.6795, -1031.9573, 45.2296, 271.7698], rotation: 70.0 },
	{ coords: [-341.0572, -1054.2097, 45.2272, 261.5746], rotation: 70.0 },
	{ coords: [-333.2138, -1032.5966, 45.2899, 255.0691], rotation: 70.0 },
	{ coords: [-332.8487, -1048.2506, 45.2337, 10.2903], rotation: 70.0 },
	{ coords: [-332.8487, -1048.2506, 45.2337, 10.2903], rotation: 70.0 },
	{ coords: [-334.1627, -1058.9235, 45.2948, 256.1040], rotation: 70.0 },
	{ coords: [-325.0476, -1033.5397, 45.2264, 271.6854], rotation: 70.0 },
	{ coords: [-325.8711, -1059.1672, 45.2342, 263.1199], rotation: 70.0 },
	{ coords: [-312.2982, -1040.7257, 45.2507, 109.6542], rotation: 70.0 },
	{ coords: [-313.2722, -1066.5492, 45.2938, 82.9694], rotation: 70.0 },
	{ coords: [-303.8553, -1041.5046, 45.2952, 70.0232], rotation: 70.0 },
	{ coords: [-304.6641, -1067.0217, 45.2954, 71.5061], rotation: 70.0 },
	{ coords: [-297.1705, -1045.6885, 45.2954, 86.5840], rotation: 70.0 },
	{ coords: [-305.5876, -1051.6250, 45.2376, 198.3554], rotation: 70.0 },
	{ coords: [-296.7383, -1068.0686, 45.2264, 86.3660], rotation: 70.0 },
	{ coords: [-290.2336, -1050.5920, 45.2229, 51.4837] , rotation: 70.0 },
	{ coords: [-288.3881, -1068.9478, 45.2250, 76.9939], rotation: 70.0 },
	{ coords: [-283.3085, -1054.8480, 45.2238, 91.0830], rotation: 70.0 }
] as const
const HOTEL_SAFES: Record<string, Safe> = Object.fromEntries(
  Array.from({ length: FLOORS_AMOUNT }, (_, floorIndex) =>
    Array.from({ length: ROOMS_PER_FLOOR }, (_, roomIndex) => [
      `${floorIndex + FIRST_FLOOR_INDEX}${String(roomIndex + 1).padStart(2, '0')}`,
      {
				coords: FIRST_FLOOR_SAFES[roomIndex]?.coords.map(coord => coord + FLOOR_HEIGHT * floorIndex),
				rotation: FIRST_FLOOR_SAFES[roomIndex]?.rotation
			}
    ])
  ).flat()
);

for (const [, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
  exports.ox_target.addBoxZone({
    coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
    options: {
      label: 'Open Safe'
    }
  });
}