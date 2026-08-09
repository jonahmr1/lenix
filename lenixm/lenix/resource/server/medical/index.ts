import { checkDependency } from "@overextended/ox_lib"
import { api } from "lenix/server"

checkDependency('ox_inventory', '2.47.9', true)

onNet('lenix:server:medical:revive', (target: number) => {
	api.ox_inventory?.RemoveItem?.(source, 'medkit', 1)
	emitNet('lenix:client:medical:heal', target)
})
