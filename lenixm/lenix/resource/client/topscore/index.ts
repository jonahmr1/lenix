import { triggerServerCallback } from "@overextended/ox_lib/client";

setImmediate(async () => {
	const ret = await triggerServerCallback('lenix:server:topscore:getData', null)
	const t = [-262.79, -964.18, 30.22, 181.71]

	console.debug(ret)
})