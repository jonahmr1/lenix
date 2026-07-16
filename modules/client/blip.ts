// deno-lint-ignore-file no-undef

import type { Vec4 } from '../index.ts'

/**
 * Options used to create a map blip.
 */
export interface Blip {
	/**
	 * Blip world coordinates and heading.
	 */
	coords: Vec4
	/**
	 * FiveM blip sprite id.
	 */
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

const destroy = (blip: number): void => {
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
