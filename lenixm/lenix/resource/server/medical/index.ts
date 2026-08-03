import { api } from "lenix/server"

onNet('lenix:server:medical:revive', (target: number) => {
	api.ox_inventory?.RemoveItem?.(source, 'medkit', 1)
	emitNet('lenix:client:medical:heal', target)
})
