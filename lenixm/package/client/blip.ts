import type { Vec3 } from '../shared/types.ts'

export interface Blip {
	/**
	 * Blip world coordinates and heading.
	 */
	coords: Vec3
	/**
	 * FiveM blip sprite id.
	 */
	icon: number
}

const blips = new Set<number>()

/**
 * Creates a tracked map blip.
 */
const create = ({
	coords,
	icon
}: Blip): number => {
	const blip = AddBlipForCoord(coords[0], coords[1], coords[2])

	SetBlipSprite(blip, icon)
	blips.add(blip)

	return blip
}

/**
 * Removes a tracked map blip.
 */
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
