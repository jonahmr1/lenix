onNet('ox:revivePlayer', (target: number) => {
	globalThis.exports.ox_inventory.RemoveItem(source, 'medkit', 1)
	emitNet('ox:healPlayer', target)
})