import { triggerPromise, trace, info } from '@trippler/tr_lib/client'
import { awaitInstanceExisting } from '@trippler/tr_lib/shared'
import { CreateSingleVehicle } from '../../shared'
import { spawnVehicleEntity, applySettings } from './wrappers'

const deletedVehicles = new Set<number>()

export const createSingleVehicle = async (settings: CreateSingleVehicle) => {
	const entityHash = settings.hash
	const entityModel = GetDisplayNameFromVehicleModel(entityHash)
	const preCreateEntity = settings?.preCreate
	const vehiclePlate = settings?.plate
	const giveVehicleKey = settings?.giveKey
	const setFuelAmount = settings?.setFuelAmount
	const customizeVehicle = settings?.customize
	const registerOwnedVehicle = settings?.register
	const warpIntoVehicle = {
		entityNetId: settings?.warp?.entityNetId,
		seat: settings?.warp?.seat
	}
	const vehicleEngine = {
		instantly: settings?.engine?.instantly,
		disableAutoStart: settings?.engine?.disableAutoStart,
	}
	let coords = settings.coords
	
	const [entityHandle, entityNetId] = await spawnVehicleEntity(entityHash, coords)
	if (!entityNetId) return
	
	if (registerOwnedVehicle) {
		const response = await triggerPromise('registerCreatedVehicle', null, entityModel, entityHash, null, vehiclePlate)
		if (!response) {
			trace('Failed to register the vehicle')
			destroyCreatedVehicle(entityNetId)
			return [false, false]
		}
	}

	applySettings({
		warp: warpIntoVehicle,
		preCreate: preCreateEntity,
		handle: entityHandle,
		plate: vehiclePlate,
		giveKey: giveVehicleKey,
		setFuelAmount,
		engine: vehicleEngine,
		customize: customizeVehicle
	} as CreateSingleVehicle & { handle: number })

	on('onResourceStop', (resourceName: string) => {
		if (GetCurrentResourceName() == resourceName) {
			trace(`${resourceName} caught stopping, clearing vehicle ${entityNetId}`)
			destroyCreatedVehicle(entityNetId)
		}
	})
	return [entityHandle, entityNetId]
}

export const destroyCreatedVehicle = async (netId: number) => {
	if (typeof netId !== 'number') {
		trace(`expected a number at #1, got ${typeof netId}`)
		return false
	}
	if (deletedVehicles.has(netId)) {
		trace(`Vehicle ${netId} already deleted, skipping`)
		return true
	}
	const [vehicle, existingNetId] = await awaitInstanceExisting(null, netId)
	if (!vehicle || vehicle === false) {
		info(`Vehicle ${netId} does not exist`)
		return false
	}
	DeleteEntity(vehicle)
	deletedVehicles.add(existingNetId)
	return true
}