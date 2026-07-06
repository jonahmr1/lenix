import { HOTEL_SAFES } from "common/hotel"

const SAFE_SIZE = [0.66, 0.66, 0.66] as const

for (const [, { coords, rotation }] of Object.entries(HOTEL_SAFES)) {
  globalThis.exports.ox_target.addBoxZone({
    coords: coords,
		size: SAFE_SIZE,
		rotation: rotation,
    options: {
      label: 'Open Safe'
    }
  })
}