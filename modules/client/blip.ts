// deno-lint-ignore-file no-undef

import type { Vec4 } from '../index.ts'

export interface Blip {
	coords: Vec4,
	icon: number
}

const blips = new Set<number>()

const create = ({
	coords,
	icon
}: Blip): number => {
	const blip = AddBlipForCoord(coords[0], coords[1], coords[2])
	SetBlipSprite(blip, icon)
	
	blips.add(blip)
	return blip
}

const destroy = (blip: number) => {
	RemoveBlip(blip)
	blips.delete(blip)
}

export const blip = {
	create,
	destroy
}

on('onResourceStop', (resourceName: string) => {
	if (resourceName !== GetCurrentResourceName()) return 

	blips.forEach(destroy)
})