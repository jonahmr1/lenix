export const entity = {
	handle: (netId: number) => NetworkGetEntityFromNetworkId(netId),
	handleBySource: (source: number) => GetPlayerPed(source.toString()),
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
}