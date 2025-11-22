function preCreateVehicle(netId) {
	const entity = NetworkGetEntityFromNetworkId(netId);

	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			SetEntityAlpha(entity, 51, false);
			setTimeout(() => {
				SetEntityAlpha(entity, 102, false);
			}, 100);
		}, i * 200);
	}

	setTimeout(() => {
		ResetEntityAlpha(entity);
	}, 2000);
}

const spawnEntity = async (hash, coords) => {
	const response = await lib.requestModel(hash, 1000)
	if (!response) lib.console.err('failed to load the model with hash of: ' + hash)
	
	const createdHandle = CreateVehicle(hash, coords.x, coords.y, coords.z, coords.w, true, true)
	
	let [handle, netId] = await lib.awaitInstanceExisting(createdHandle)
	if (!netId) return;
	return [handle, netId]
}

const applySettings = async (warp, preCreate, netId, handle, plate, giveKey, setFuelAmount, engine, customize) => {
	const [pedHandle, _] = await lib.awaitInstanceExisting(null, warp.pedHandle)
	preCreate && preCreateVehicle(netId);
	plate && SetVehicleNumberPlateText(handle, plate);

	warp && TaskWarpPedIntoVehicle(pedHandle, handle, warp.seat)
	plate && giveKey && Bridge.giveKey(plate)
  setFuelAmount && Bridge.setFuel(handle, setFuelAmount)
	engine && SetVehicleEngineOn(handle, true, engine.instantly, engine.disableAutoStart)
	if (customize) {
		SetVehicleCustomPrimaryColour(handle, customize[0], customize[1], customize[2])
		SetVehicleCustomSecondaryColour(handle, customize[0], customize[1], customize[2])
		SetVehicleLivery(handle, customize.livery)
		SetVehicleMod(handle, 48, customize.livery, false)
	}
}

async function createSingleVehicle(settings) {
	const hash = settings.hash
	const model = GetDisplayNameFromVehicleModel(hash)
	const preCreate = settings.preCreate ?? false
	const plate = settings.plate ?? false
	const warp = {
		entityNetId: settings.warp.entityNetId ?? false,
		seat: settings.warp.seat ?? -1
	}
	const giveKey = settings.giveKey ?? false
	const setFuelAmount = settings.setFuelAmount ?? false
	const engine = {
		instantly: settings.engine.instantly ?? false,
		disableAutoStart: settings.engine.disableAutoStart ?? false,
	} ?? false
	const customize = settings.customize ?? false
	const register = settings.register ?? false
	let coords = settings.coords
	
	if (Array.isArray(coords)) {
		coords = { x: coords[0], y: coords[1], z: coords[2], w: coords[3] }
	}

	const [handle, netId] = await spawnEntity(hash, coords)
	if (!netId) return;

	applySettings(warp, preCreate, netId, handle, plate, giveKey, setFuelAmount, engine, customize)
	
	register && await lib.callback.await('registerCreatedVehicle', null, model, hash, null, plate)

	on('onResourceStop', (resourceName) => {
		if (GetCurrentResourceName() == resourceName) {
			console.log(`${resourceName} caught stopping, clearing vehicle ${netId}`)
			clearCreatedVehicle(netId)
		}
	})
	return [handle, netId]
}

lib.callback.register('createSingleVehicle', async (settings) => {
	return await createSingleVehicle(settings)
})

async function createMultipleVehicles(settings) {
	return await lib.callback.await('createMultipleVehicles', null, settings)
}

async function clearCreatedVehicle(netId) {
	return await lib.callback.await('clearCreatedVehicle', null, netId)
}

async function clearCreatedVehicles(netId) {
	return await lib.callback.await('clearCreatedVehicles', null, netId)
}

exports('createSingleVehicle', createSingleVehicle)
exports('createMultipleVehicles', createMultipleVehicles)
exports('clearCreatedVehicle', clearCreatedVehicle)
exports('clearCreatedVehicles', clearCreatedVehicles)