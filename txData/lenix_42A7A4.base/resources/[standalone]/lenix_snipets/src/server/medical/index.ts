onNet('ox:revivePlayer', (target: number) => {
	exports.ox_inventory.RemoveItem(source, 'medkit', 1)
	emitNet('ox:healPlayer', target)
})