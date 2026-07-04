import { cache } from "@overextended/ox_lib"
import { startIdentities } from "../identities"
import { startCuffs } from "../cuffs"
import { startWeapon } from "../weapon"

setTick(() => {
	SetPedStealthMovement(cache.ped, false, "nil")

	SetParkedVehicleDensityMultiplierThisFrame(0.0)
	SetVehicleDensityMultiplierThisFrame(0.0)
	SetRandomVehicleDensityMultiplierThisFrame(0.0)
	SetPedDensityMultiplierThisFrame(0.0)
	SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0)

	startIdentities()

	startCuffs()
	
	SetPedConfigFlag(cache.ped, 184, true)

	DisplayAmmoThisFrame(false)

	startWeapon()
})