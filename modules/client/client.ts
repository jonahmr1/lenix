import { repeat } from '../shared/repeat.ts'
import type { Vec3, Vec4 } from '../shared/types.ts'

export const client = {
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
		handle: (entityNetId: number) => NetworkGetEntityFromNetworkId(entityNetId),

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
		netId: (entity: number) => NetworkGetNetworkIdFromEntity(entity),

		/**
		 * Gets entity coordinates and heading.
		 */
		coords: (() => {
			function coords(entity: number, excludeH: boolean, isAlive?: boolean): Vec3
			function coords(entity: number, excludeH?: false, isAlive?: boolean): Vec4
			function coords(entity: number, excludeH = false, isAlive = true) {
				const entityCoords = GetEntityCoords(entity, isAlive) as Vec3

				if (excludeH) return entityCoords

				return [
					...entityCoords,
					GetEntityHeading(entity)
				]
			}

			return coords
		})(),

		/*  */
		teleport: (
			entity: number,
			x: number,
			y: number,
			z: number,
			h?: number,
			clearArea = false,
			alive = true,
			deadDisable = false,
			ragdol = false
		) => {
			SetEntityCoords(entity, x, y, z, alive, deadDisable, ragdol, clearArea)
			h && SetEntityHeading(entity, h)
		},

		/*  */
		playAnim: async (
			ped: number,
			dict: string,
			name: string,
			blendIn = 2.0,
			blendOut = 2.0,
			duration = -1,
			flag = 0,
			playbackFrom = 0.0,
			x = false,
			y = false,
			z = false
		) => {
			RequestAnimDict(dict)
			await repeat(() => HasAnimDictLoaded(dict), true)
			TaskPlayAnim(ped, dict, name, blendIn, blendOut, duration, flag, playbackFrom, x, y, z)
		},

		/*  */
		stopAnim: (ped: number, dict: string) => {
			RemoveAnimDict(dict)
			ClearPedTasks(ped)
		}
	},
	player: {
		/*  */
		handle: () => PlayerPedId(),

		/*  */
		netId: () => client.entity.netId(client.player.handle()),

		/*  */
		coords: () => client.entity.coords(client.player.handle()),

		/*  */
		teleport: (
			x: number,
			y: number,
			z: number,
			h?: number,
			clearArea?: boolean,
			alive?: boolean,
			deadDisable?: boolean,
			ragdol?: boolean
		) => client.entity.teleport(client.player.handle(), x, y, z, h, clearArea, alive, deadDisable, ragdol),

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
		serverId: (playerId?: number) => GetPlayerServerId(playerId ?? client.player.id()),

		storage: {
			set: <Storage>(
				...[key, value]: {
					[K in keyof Storage]: [key: Extract<K, string>, value: Extract<Storage[K], string>]
				}[keyof Storage]
			) => SetResourceKvp(key, value),

			get: <Storage, K extends Extract<keyof Storage, string>>(
				key: K,
				init?: Extract<Storage[K], string>
			): Storage[K] => {
				const get = GetResourceKvpString
				if (!get(key)) {
					if (init === undefined || init === null) throw new Error(`Failed to get Storage<${key}> value, reason: The key was never assigned before and you did not provided an initiate value`)
					client.player.storage.set<Storage>(key, init)
				}
				return get(key) as Storage[K]
			},

			delete: <Storage>(
				key: Extract<keyof Storage, string>
			) => DeleteResourceKvp(key),
			/* TODO: add on event */
		}
	}
}
