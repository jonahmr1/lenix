import { FIRST_ROOMS_FLOOR_INDEX, FLOOR_HEIGHT, FLOORS_AMOUNT } from 'common/hotel'

interface DoorData {
	coords: { x: number; y: number; z: number }
	model: number
	heading: number
	items: { name: string; metadata: { type: string } }[]
	state: number
	doors: boolean
	maxDistance: number
}

type DoorTemplate = Omit<DoorData, 'items'>

const FIRST_FLOOR_DOORS: [string, DoorTemplate][] = [
	[
		'401',
		{
			coords: { x: -346.3399963378906, y: -1045.771240234375, z: 46.09851837158203 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'402',
		{
			coords: { x: -342.77606201171877, y: -1035.844970703125, z: 46.09851837158203 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'403',
		{
			coords: { x: -339.4240417480469, y: -1050.38818359375, z: 46.09851837158203 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'404',
		{
			coords: { x: -334.51043701171877, y: -1036.6956787109376, z: 46.09854507446289 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'405',
		{
			coords: { x: -336.3227844238281, y: -1046.832763671875, z: 46.10463714599609 },
			model: -1363027910,
			heading: 250,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'406',
		{
			coords: { x: -332.51702880859377, y: -1055.00048828125, z: 46.09851837158203 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'407',
		{
			coords: { x: -326.2508850097656, y: -1037.54541015625, z: 46.09854507446289 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'408',
		{
			coords: { x: -320.01318359375, y: -1060.01513671875, z: 46.09836959838867 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'409',
		{
			coords: { x: -318.2320251464844, y: -1039.9185791015626, z: 46.09839630126953 },
			model: -1363027910,
			heading: 160,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'410',
		{
			coords: { x: -312.0002136230469, y: -1062.3961181640626, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'411',
		{
			coords: { x: -305.7173767089844, y: -1044.9371337890626, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'412',
		{
			coords: { x: -303.72216796875, y: -1063.2440185546876, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'413',
		{
			coords: { x: -298.8063049316406, y: -1049.5535888671876, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'414',
		{
			coords: { x: -302.0152282714844, y: -1053.13818359375, z: 46.10463714599609 },
			model: -1363027910,
			heading: 70,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'416',
		{
			coords: { x: -291.9009094238281, y: -1054.16455078125, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'415',
		{
			coords: { x: -295.4645080566406, y: -1064.0968017578126, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'417',
		{
			coords: { x: -287.1836853027344, y: -1064.9407958984376, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
	[
		'418',
		{
			coords: { x: -284.9868469238281, y: -1058.800048828125, z: 46.09851837158203 },
			model: -1363027910,
			heading: 340,
			state: 1,
			doors: false,
			maxDistance: 2,
		},
	],
]

const rows: string[] = []

for (let floorIndex = 0; floorIndex < FLOORS_AMOUNT; floorIndex++) {
	const floorNumber = floorIndex + FIRST_ROOMS_FLOOR_INDEX

	for (const [key, data] of FIRST_FLOOR_DOORS) {
		const roomSuffix = key.slice(-2) // preserves '01'..'18'
		const name = `${floorNumber}${roomSuffix}`
		const roomIndex = `Room ${name}`

		const newData: DoorData = {
			...data,
			coords: {
				x: data.coords.x,
				y: data.coords.y,
				z: data.coords.z + FLOOR_HEIGHT * floorIndex,
			},
			items: [{ name: 'hotel_keycard', metadata: { type: roomIndex } }],
		}

		rows.push(`('${name}', '${JSON.stringify(newData)}')`)
	}
}

// bun run _generator.ts > hotel_doors.sql
console.log(`INSERT INTO \`ox_doorlock\` (\`name\`, \`data\`) VALUES\n${rows.join(',\n')};`)
