import { cache } from "@overextended/ox_lib"

setTick(() => {
	SetPedStealthMovement(cache.ped, false, "nil")
})