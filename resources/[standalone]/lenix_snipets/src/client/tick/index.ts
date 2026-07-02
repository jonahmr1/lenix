import { cache } from "@overextended/ox_lib"
import { startIdentities } from "../identities"

setTick(() => {
	SetPedStealthMovement(cache.ped, false, "nil")

	SetParkedVehicleDensityMultiplierThisFrame(0.0)
	SetVehicleDensityMultiplierThisFrame(0.0)
	SetRandomVehicleDensityMultiplierThisFrame(0.0)
	SetPedDensityMultiplierThisFrame(0.0)
	SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0)

	startIdentities()
})