on('ox:createdCharacter', (playerId, userId, charId) => {
	const { id, label, slots, weight, owner }: {
		id: string
		label: string
		slots: number
		weight: number
		owner: `charId:${number}`
		coords: Vector
	} = {
		id: '42wallabyway',
		label: '42 Wallaby Way',
		slots: 100,
		weight: 100000,
		owner: `charId:${charId}`,
		coords: 
	}
	exports.ox_inventory.RegisterStash(id, label, slots, weight, owner)

	console.debug(playerId, userId, charId)
})