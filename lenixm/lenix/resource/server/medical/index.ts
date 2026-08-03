import { api } from "lenix"

onNet('lenix:server:medical:revive', (target: number) => {
	api.ox_inventory?.RemoveItem?.(source, 'medkit', 1)
	emitNet('lenix:client:medical:heal', target)
})
