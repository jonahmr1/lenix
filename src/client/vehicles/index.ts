import { trace, info } from '@trippler/tr_lib/shared'
import { awaitInstanceExisting , triggerPromise} from '@trippler/tr_lib/client'
import { CreateSingleVehicle } from '../../shared'
import { spawnVehicleEntity, applySettings } from './wrappers'

const deletedVehicles = new Set<number>()

export const createSingleVehicle = async (settings: CreateSingleVehicle) => {
	const entityHash = settings.hash
	const entityModel = GetDisplayNameFromVehicleModel(entityHash)
	const preCreateEntity = settings?.preCreate
	const vehiclePlate = settings?.plate
	const giveVehicleKey = settings?.giveKey
	const setFuelAmount = settings?.fuelAmount
	const customizeVehicle = settings?.customize
	const registerOwnedVehicle = settings?.register
	const warpIntoVehicle = {
		entityNetId: settings?.warp?.netId,
		seat: settings?.warp?.seat
	}
	const vehicleEngine = {
		instantly: settings?.engine?.instantly,
		disableAutoStart: settings?.engine?.disableAutoStart,
	}
	const spawnCoords = settings.coords
	const result = await spawnVehicleEntity(entityHash, spawnCoords)
  if (!result) return

	const [entityHandle, entityNetId] = result
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
		fuelAmount: setFuelAmount,
		engine: vehicleEngine,
		customize: customizeVehicle
	} as unknown as CreateSingleVehicle & { handle: number })

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
	if (!vehicle) {
		info(`Vehicle ${netId} does not exist`)
		return false
	}
	DeleteEntity(vehicle)
	deletedVehicles.add(netId)
	return true
}