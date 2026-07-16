// deno-lint-ignore-file no-undef
import type { Vec3, Vec4 } from '../shared/types.ts'

/**
 * Gets entity coordinates and heading.
 */
function coords(excludeH: true, entity?: number, isAlive?: boolean): Vec3
function coords(excludeH?: false, entity?: number, isAlive?: boolean): Vec4
function coords(excludeH = false, entity = PlayerPedId(), isAlive = true): Vec3 | Vec4 {
	const entityCoords = GetEntityCoords(entity, isAlive) as Vec3

	if (excludeH) return entityCoords

	return [
		...entityCoords,
		GetEntityHeading(entity)
	]
}

export const getEntity = {
	coords
}
