import { cache } from '@overextended/ox_lib'
import { displayIdentities } from '../identities'
import { setCuffs } from '../cuffs'
import { setHudState } from '../hud'

setTick(() => {
	SetPedStealthMovement(cache.ped, false, 'nil')

	// disable peds
	SetParkedVehicleDensityMultiplierThisFrame(0.0)
	SetVehicleDensityMultiplierThisFrame(0.0)
	SetRandomVehicleDensityMultiplierThisFrame(0.0)
	SetPedDensityMultiplierThisFrame(0.0)
	SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0)

	// disable autoshuffle
	SetPedConfigFlag(cache.ped, 184, true)

	DisplayAmmoThisFrame(false)

	displayIdentities()

	setCuffs()


	setHudState()
})
