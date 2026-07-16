// deno-lint-ignore-file no-undef
import type { Vec3, Vec4 } from '../shared/types.ts'

/**
 * Gets entity coordinates and heading.
 */
const coords = (entity = PlayerPedId(), isAlive = true): Vec4 => [
	...GetEntityCoords(entity, isAlive) as Vec3,
	GetEntityHeading(entity)
]

export const getEntity = {
	coords
}
