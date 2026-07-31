import { triggerServerCallback } from "@overextended/ox_lib/client";
import type { Vec4 } from "lenix";
import { emitEvent } from "lenix/client";
import type { Events } from "types/index";

setImmediate(async () => {
	const ret = await triggerServerCallback('lenix:server:topscore:getData', null)
	const coords: Vec4 = [-262.79, -964.18, 30.22, 181.71]

	emitEvent<Events['updateTopscoreCoords']>('topscore:updateCoords', {
		scale: ,
		top: ,
		left: ,
	})
})