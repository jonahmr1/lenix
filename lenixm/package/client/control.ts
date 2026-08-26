import { asserts } from '@lenix/lenix'
import { pool } from './pool'

export interface Bind {
	event: keyof typeof EVENTS,
	key: keyof typeof CONTROLS,
	onEvent: () => void,
	type: keyof typeof TYPES,
}

const EVENTS = {
	press: IsControlJustPressed,
	hold: IsControlPressed,
	release: IsControlJustReleased,
	released: IsControlReleased,
	disabled: IsDisabledControlJustPressed,
	disable: DisableControlAction,
	enable: EnableControlAction,
}
export const TYPES = {
	player: 0,
	camera: 1,
	frontend: 2,
} as const
export const CONTROLS = {
	MOUSE_LEFT: [18, 24, 69, 92, 106, 122, 135, 142, 144, 176, 223, 229, 237, 257, 329, 346],
	D: [9, 20, 35, 59, 64, 90, 134, 146, 148, 195, 218, 235, 266, 267, 278, 279, 339, 342],
	S: [8, 31, 33, 72, 78, 88, 130, 139, 149, 151, 196, 219, 233, 268, 269, 302],
	SPACE: [18, 22, 55, 76, 102, 143, 179, 203, 216, 255, 298, 321, 328, 353],
	MOUSE_RIGHT: [25, 68, 70, 91, 114, 177, 222, 225, 238, 330, 331, 347],
	E: [38, 46, 51, 54, 86, 103, 119, 153, 184, 206, 350, 351, 355, 356],
	LCONTROL: [36, 60, 62, 132, 210, 224, 280, 281, 326, 341, 343],
	LBRACKET: [39, 41, 43, 100, 116, 274, 275, 276, 277, 312],
	X: [73, 105, 120, 154, 186, 252, 323, 337, 345, 354, 357],
	LSHIFT: [21, 61, 131, 155, 209, 254, 340, 352],
	Q: [44, 52, 85, 138, 141, 152, 205, 264],
	W: [32, 71, 77, 87, 129, 136, 150, 232],
	A: [34, 63, 89, 133, 147, 234, 338],
	F: [23, 49, 75, 144, 145, 185, 251],
	DELETE: [178, 214, 256, 296, 297],
	RETURN: [18, 176, 191, 201, 215],
	R: [45, 80, 140, 250, 263, 310],
	TAB: [37, 192, 204, 211, 349],
	NUMPAD6: [107, 109, 123, 125],
	NUMPAD5: [110, 112, 126, 128],
	RBRACKET: [40, 42, 197, 313],
	ESCAPE: [177, 200, 202, 322],
	C: [26, 79, 253, 319, 324],
	LEFT: [174, 189, 190, 308],
	CAPITAL: [137, 171, 217],
	PAGEDOWN: [11, 207, 317],
	MOUSE_MIDDLE: [27, 348],
	UP: [27, 172, 188, 300],
	PAGEUP: [10, 208, 316],
	V: [0, 236, 320, 325],
	DOWN: [173, 187, 299],
	G: [47, 183, 58, 113],
	H: [74, 101, 104, 304],
	BACK: [177, 194, 202],
	RIGHT: [175, 307],
	SUBTRACT: [96, 315],
	NUMPAD4: [108, 124],
	NUMPAD8: [111, 127],
	HOME: [212, 213],
	Z: [20, 48],
	B: [19, 305],
	M: [244, 301],
	T: [245, 309],
	N: [249, 306],
	LMENU: [19],
	PERIOD: [81],
	COMMA: [82],
	EQUALS: [83],
	MINUS: [84],
	ADD: [97, 314],
	NUMPAD7: [117],
	NUMPAD9: [118],
	INSERT: [121],
	NUMPADENTER: [201],
	GRAVE: [243],
	1: [157],
	2: [158],
	6: [159],
	3: [160],
	7: [161],
	8: [162],
	9: [163],
	4: [164],
	5: [165],
	L: [182],
	P: [199],
	Y: [246],
	U: [303],
	K: [311],
	F1: [288],
	F2: [289],
	F3: [170],
	F5: [166, 318, 327],
	F6: [167],
	F7: [168],
	F8: [169],
	F9: [56],
	F10: [57],
	F11: [344],
} as const


const binds = new Set<Bind>()

const on = ({
	event,
	key,
	onEvent: cb,
	type = 'player',
}: Omit<Bind, 'event' | 'type'> & {
	type?: Bind['type']
} & {
	event: Exclude<Bind['event'], 'disable' | 'enable'>
}) => {
	asserts(CONTROLS[key], `Could not find key<${key}>`)

	const bind = {
		event, key, onEvent: cb, type
	}
	binds.add(bind)
	
	return () => binds.delete(bind)
}
const disable = ({
	key,
	type = 'player',
}: Pick<Bind, 'key'> & {
	type?: Bind['type']
}) => {
	asserts(CONTROLS[key], `Could not find key<${key}>`)

	binds.add({
		event: 'disable', key, onEvent: () => {}, type
	})
}
const enable = ({
	key,
	type = 'player',
}: Pick<Bind, 'key'> & {
	type?: Bind['type']
}) => {
	asserts(CONTROLS[key], `Could not find key<${key}>`)

	binds.add({
		event: 'enable', key, onEvent: () => {}, type
	})
}

pool(() => binds.forEach(({ event, key, onEvent: cb, type }) => {
	for (const index of CONTROLS[key]) {
		if (!EVENTS[event](TYPES[type], index, true)) continue
		cb()
		break
	}
}))

/**
 * @beta This API is in beta. Use with caution.
 */
export const control = {
	on,
	disable,
	enable
}
