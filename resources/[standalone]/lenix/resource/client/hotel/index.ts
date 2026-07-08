import { HOTEL_SAFES } from 'common/hotel'

const SAFE_SIZE = [1.66, 1.66, 1.66] as const

console.debug(true)
for (const [, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
	globalThis.exports.ox_target.addBoxZone({
		coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
		debug: true,
		options: {
			label: 'Open Safe',
		},
	})
}
