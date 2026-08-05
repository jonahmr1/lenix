import { palette } from "lenix"

let currentVehicle = 0
const vehicleAlpha = 200
const pedAlpha = 125

const ghostVehicle = () => {
	const ped = PlayerPedId()
	const vehicle = GetVehiclePedIsIn(ped, false)

	if (vehicle !== 0) {
		SetEntityAlpha(vehicle, vehicleAlpha, false)
		SetEntityAlpha(ped, pedAlpha, false)
		currentVehicle = vehicle
	} else if (currentVehicle !== 0) {
		if (DoesEntityExist(currentVehicle)) {
			ResetEntityAlpha(currentVehicle)
			SetEntityAlpha(currentVehicle, 255, false)
		} else console.log(palette('pink', 'vehicle entity does not exist'))
		ResetEntityAlpha(ped)
		SetEntityAlpha(ped, 255, false)
		currentVehicle = 0
	} else throw 'Something was not well analysed went wrong'
}

setTick(() => {
	SetParkedVehicleDensityMultiplierThisFrame(0.0)
	SetVehicleDensityMultiplierThisFrame(0.0)
	SetRandomVehicleDensityMultiplierThisFrame(0.0)
	SetPedDensityMultiplierThisFrame(0.0)
	SetScenarioPedDensityMultiplierThisFrame(0.0, 0.0)

	SetPedStealthMovement(PlayerPedId(), false, 'nil')

	// disable shuffle
	SetPedConfigFlag(PlayerPedId(), 184, true)

	DisplayAmmoThisFrame(false)

	// ghostVehicle()
})
