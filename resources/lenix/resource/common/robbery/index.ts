import type { Vector4 } from "types/index"

export const VEHICLE_COORDS: Vector4[] = [
	[-1209.2249, -1162.8300, 7.6913, 13.5316],
	[1070.0637, -233.9568, 69.6071, 253.4912],
	[691.7452, -1726.9247, 29.2780, 83.3026],
]
export const VEHICLE_MODEL: string = 'Stockade'
export const MIN_TEAMS_TO_START_ROBBERY: number = 1
export const MISSION_PRICE = 2000
export const VEHICLE_BLIP_UPDATE_INTERVAL = 1000
export const PEDS_MODEL = 'mp_s_m_armoured_01'
export const VEHICLE_PEDS_AMOUNT = 6

export const random = (from: number, to?: number) => {
  if (to === undefined) return Math.floor(Math.random() * (from + 1))
  return Math.floor(Math.random() * (to - from + 1)) + from
}