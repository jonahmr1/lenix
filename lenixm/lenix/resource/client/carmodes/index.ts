import { asserts, entries } from '@lenix/lenix'
import { addKeybind, notify } from '@overextended/ox_lib/client'
import { AUTHORIZED_JOBS, DEFAULT_KEY, TIER_CONFIG, VEHICLE_MODES, VEHICLE_MODS, VEHICLE_TIERS } from 'common/config'
import { ResourceName } from 'common/resource'
import { api } from 'lenix/client'

const Core = api['qb-core']?.GetCoreObject?.()
const Shared = Core.Shared

let gear = 1,
	currentVehicle = 0

let currentVehicleMode: (typeof VEHICLE_MODES)[number] = VEHICLE_MODES[1]
let playerJob: {
	name: string
}

for (const [tier, vehicles] of entries(VEHICLE_TIERS)) {
	for (const [, model] of vehicles) {
		if (Shared.Vehicles[model]) {
			Shared.Vehicles[model].tier = tier
			Shared.VehicleHashes[Shared.Vehicles[model].hash].tier = tier
			console.log(`Vehicle ${model} has been assigned to tier: ${tier}`)
		} else console.log(`Vehicle ${model} not found in Shared.Vehicles, skipping tier assignment.`)
	}
}

const updatemode = () => {
	const vehicle = IsCheckValid()
	if (!vehicle) return
	UpdateVehicleMode(vehicle)
	UpdateHandling(vehicle)
	ApplyVehicleMods(vehicle)
	notify({
		title: 'success',
		description: `${currentVehicleMode} mode applied`,
		type: 'success',
		duration: 1500,
	})
}

const GetVehicleData = () => {
	const vehicleEntity = GetVehiclePedIsIn(PlayerPedId(), false)
	const vehicleData = Shared.VehicleHashes[GetEntityModel(vehicleEntity)]

	return vehicleData
}

const IsCheckValid = () => {
	const vehicleData = GetVehicleData()
	const vehicleEntity = GetVehiclePedIsIn(PlayerPedId(), false)
	if (DoesEntityExist(vehicleEntity) && IsAuthorizedToSwitchMode() && vehicleData.category == 'emergency') {
		for (const [i] of entries(TIER_CONFIG)) {
			if (i === vehicleData.tier) {
				console.log(`Valid tier found: ${i}`)
				console.log(`Vehicle category: ${vehicleData.category}`)
				return vehicleEntity
			}
		}
	}
	console.log('you are not authorized to switch modes or the vehicle is not valid.')
	return false
}

const GetHandlingConfig = () => {
	for (const [, tierData] of entries(TIER_CONFIG)) {
		for (const [mode, modeData] of entries(tierData)) {
			if (currentVehicleMode === mode) {
				console.log(`${JSON.stringify(modeData)} : 1`)
				return modeData
			}
		}
		break /* ???? */
	}
}

const UpdateHandling = (vehicle: number) => {
	const handlingConfig = GetHandlingConfig()
	asserts(handlingConfig)

	console.log(`Handling config for vehicle: ${JSON.stringify(handlingConfig)}`)
	for (const [k, v] of entries(handlingConfig)) {
		if (typeof v === 'number' && !Number.isInteger(v)) {
			SetVehicleHandlingFloat(vehicle, 'CHandlingData', k, v)
		} else if (Number.isInteger(v)) {
			SetVehicleHandlingInt(vehicle, 'CHandlingData', k, v)
		} else if (Array.isArray(v)) {
			//@ts-ignore
			SetVehicleHandlingVector(vehicle, 'CHandlingData', k, v)
		}
	}
	FixVehicleHandling(vehicle)
}

const UpdatePlayerInfo = () => {
	const playerData = Core?.Functions.GetPlayerData()
	playerJob = playerData.job
}

const UpdateVehicleMode = (vehicle: number) => {
	gear = (gear % VEHICLE_MODES.length) + 1
	if (vehicle !== currentVehicle) gear = 1
	currentVehicle = vehicle
	const mode = VEHICLE_MODES[gear]
	asserts(mode)
	currentVehicleMode = mode
	console.log(`Current vehicle mode: ${currentVehicleMode}`)
}

const IsAuthorizedToSwitchMode = () => {
	if (AUTHORIZED_JOBS === null) return true // No jobs defined

	for (const job of AUTHORIZED_JOBS as string[]) if (playerJob.name == job) return true
	return false
}

const ApplyVehicleMods = (vehicle: number) => {
	const vehicleMode = VEHICLE_MODES[gear]
	asserts(vehicleMode)
	console.log(`Applying vehicle mods for mode: ${vehicleMode}`)

	ToggleVehicleMod(vehicle, 18, VEHICLE_MODS[vehicleMode].Turbo) // Turbo
	console.log(GetVehicleMod(vehicle, 18))
	SetVehicleMod(vehicle, 11, VEHICLE_MODS[vehicleMode].Engine, false) // Engine
	SetVehicleMod(vehicle, 12, VEHICLE_MODS[vehicleMode].Brakes, false) // Brakes
	SetVehicleMod(vehicle, 13, VEHICLE_MODS[vehicleMode].Transmission, false) // Transmission
}

const FixVehicleHandling = (veh: number) => {
	SetVehicleModKit(veh, 0)
	Array.from({ length: 36 }, (_, i) => {
		SetVehicleMod(veh, i, GetVehicleMod(veh, i), false)
	})
	Array.from({ length: 4 }, (_, i) => {
		SetVehicleWheelIsPowered(veh, i, true)
	})
}

on('QBCore:Client:OnPlayerLoaded', UpdatePlayerInfo)

on('QBCore:Client:OnJobUpdate', (job: typeof playerJob) => {
	playerJob = job
})

on('onClientResourceStart', (resourceName: string) => {
	if (GetCurrentResourceName() !== resourceName) return

	UpdatePlayerInfo()
})

addKeybind({
	name: `${ResourceName}:carmodes:toggleMode`,
	description: 'Change pursuitmode',
	defaultKey: DEFAULT_KEY,
	onPressed: updatemode,
})
