onNet('lenix:server:medical:revive', (target: number) => {
	globalThis.exports.ox_inventory.RemoveItem(source, 'medkit', 1)
	emitNet('lenix:client:medical:heal', target)
})
