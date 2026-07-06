import type { Vector4 } from "types/public"



on('ox:createdCharacter', (playerId, userId, charId) => {
	const { id, label, slots, weight, owner }: {
		id: string
		label: string
		slots: number
		weight: number
		owner: `charId:${number}`
		coords: Vector4
	} = {
		id: ,
		label: ,
		slots: 100,
		weight: 100000,
		owner: `charId:${charId}`,
		coords: []
	}
	
	exports.ox_inventory.RegisterStash(id, label, slots, weight, owner)

	console.debug(playerId, userId, charId)
})