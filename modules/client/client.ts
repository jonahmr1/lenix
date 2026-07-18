import type { Vec3, Vec4 } from '../shared/types.ts'


export const client: {
	entity: {
		handle: (entityNetId?: number) => number
		netId: (entity?: number) => number
		coords: {
			(excludeH: true, entity?: number, isAlive?: boolean): Vec3;
			(excludeH?: false, entity?: number, isAlive?: boolean): Vec4
		}
		teleport: (
			x: number,
			y: number,
			z: number,
			h?: number,
			entity?: number,
			clearArea?: boolean,
			alive?: boolean,
			deadDisable?: boolean,
			ragdol?: boolean
		) => void
	}
	player: {
		serverId: (playerId?: number) => number
		id: (serverId?: number) => number
		storage: {
			set: <T extends string>(key: T, value: string) => void
			get: <T extends string>(key: T) => string
			delete: <T extends string>(key: T) => void
		}
	}
} = {
	entity: {
		/**
		 * Gets the local entity handle from a network ID.
		 *
		 * Network IDs are shared, but entity handles are local.
		 * The returned handle is only valid on the current machine.
		 *
		 * If no network ID is provided, this resolves your own player ped
		 * by first getting its network ID.
		 *
		 * Examples:
		 * - entity(vehicleNetId) -> local vehicle handle
		 * - entity(pedNetId) -> local ped handle
		 * - entity() -> your own player ped handle
		 */
		handle: (entityNetId = client.entity.netId()) => NetworkGetEntityFromNetworkId(entityNetId),

		/**
		 * Gets the network ID for an entity.
		 *
		 * Entity handles are local to the current machine.
		 * Network IDs are shared references for networked entities.
		 *
		 * If no entity is provided, this uses your own player ped.
		 *
		 * Examples:
		 * - netId(vehicle) -> network ID of that vehicle
		 * - netId(targetPed) -> network ID of that ped
		 * - netId() -> network ID of your own player ped
		 */
		netId: (entity = PlayerPedId()) => NetworkGetNetworkIdFromEntity(entity),

		/**
		 * Gets entity coordinates and heading.
		 */
		coords: (() => {
			function coords(excludeH: true, entity?: number, isAlive?: boolean): Vec3
			function coords(excludeH?: false, entity?: number, isAlive?: boolean): Vec4
			function coords(excludeH = false, entity = client.entity.handle(), isAlive = true) {
				const entityCoords = GetEntityCoords(entity, isAlive) as Vec3

				if (excludeH) return entityCoords

				return [
					...entityCoords,
					GetEntityHeading(entity)
				]
			}

			return coords
		})(),

		teleport: (
			x: number,
			y: number,
			z: number,
			h?: number,
			entity = client.entity.handle(),
			clearArea = false,
			alive = true,
			deadDisable = false,
			ragdol = false
		) => {
			SetEntityCoords(entity, x, y, z, alive, deadDisable, ragdol, clearArea)
			SetEntityHeading(entity, h ?? client.entity.coords()[3])
		},
	},
	player: {
		/**
		 * Gets a client player ID.
		 *
		 * If a server ID is provided, this converts that server ID into a client
		 * player ID on the current client.
		 *
		 * If no server ID is provided, this returns your own client player ID.
		 *
		 * Examples:
		 * - id(targetServerId) -> target player's client player ID
		 * - id() -> your own client player ID
		 */
		id: (serverId?: number) => serverId ? GetPlayerFromServerId(serverId) : PlayerId(),

		/**
		 * Gets a player's server ID from their client player ID.
		 *
		 * Client player IDs are local to each client.
		 * Server IDs, also called source IDs, identify connected players on the server.
		 *
		 * If no client player ID is provided, this uses your own client player ID.
		 *
		 * Examples:
		 * - serverId(targetPlayerId) -> target player's server ID
		 * - serverId() -> your own server ID
		 */
		serverId: (playerId = client.player.id()) => GetPlayerServerId(playerId),

		storage: {
			set: <T extends string>(key: T, value: string) => SetResourceKvp(key, value),
			get: <T extends string>(key: T) => GetResourceKvpString(key),
			delete: <T extends string>(key: T) => DeleteResourceKvp(key)
		}
	}
}

