// deno-lint-ignore-file no-undef

import type { Vec4 } from '../index.ts'

export interface Blip {
	coords: Vec4,
	icon: number
}

const blips: number[] = []

export const createBlip = ({
	coords,
	icon
}: Blip): number => {
	const blip = AddBlipForCoord(coords[0], coords[1], coords[2])
	SetBlipSprite(blip, icon)
	
	blips.push(blip)
	return blip
}

on('onResourceStop', (resourceName: string) => {
	if (resourceName !== GetCurrentResourceName()) return 

	blips.forEach(blip => RemoveBlip(blip))
})