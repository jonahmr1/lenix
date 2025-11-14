async function createSinglePed(settings) {
    const hash = settings.hash;
    const scenario = settings.scenario;
    let coords = settings.coords;

    const isNotValidCoords = ((typeof coords !== 'object' && Object.keys(coords).length !== 4) || (!Array.isArray(coords) && coords.length !== 4)) ? true : false

    if (typeof hash !== 'number') {
        console.error(`Expecter a number of hash, got ${typeof hash}(${hash})`)
        return;
    }
    if (isNotValidCoords) {
        console.error(
        `Invalid argument: expected a valid vector4 object as the second argument, but received type "${typeof coords}" with values: ` +
        `x: ${coords?.x ?? coords?.[0] ?? 'undefined'}, ` +
        `y: ${coords?.y ?? coords?.[1] ?? 'undefined'}, ` +
        `z: ${coords?.z ?? coords?.[2] ?? 'undefined'}, ` +
        `w: ${coords?.w ?? coords?.[3] ?? 'undefined'}`
        );
        return;
    }
    if (Array.isArray(coords)) {
		coords = {
			x: coords[0],
			y: coords[1],
			z: coords[2],
			w: coords[3]
		}
	}

    const response = await lib.requestModel(hash, 1000)
    if (!response) return;

    const entityHandle = CreatePed(null, hash, coords.x, coords.y, coords.z, coords.w, true, true);
    let [_, netId] = await lib.awaitInstanceExisting(entityHandle)
    if (!netId) return;

    if (scenario) {
        if (scenario.name) TaskStartScenarioInPlace(entityHandle, scenario.name, scenario?.timeToLeave, scenario?.playIntroClip);
        if (scenario.freeze) FreezeEntityPosition(entityHandle, true);
        if (scenario.oblivious) SetBlockingOfNonTemporaryEvents(entityHandle, true);
    }

    on('onResourceStop', async (resourceName) => {
        if (GetCurrentResourceName() == resourceName) {
            console.log(`${resourceName} caught stopping, clearing ped (netId: ${netId})`)
            SetEntityAsNoLongerNeeded(entityHandle, true)
            clearCreatedPed(netId)
        }
    })
    return entityHandle, netId
}

lib.callback.register('createSinglePed', (settings) => {
    return createSinglePed(settings)
})

function createMultiplePeds(peds, defaultSettings) {
    return lib.callback.await('createMultiplePeds', null, peds, defaultSettings)
}

function clearCreatedPed(netId) {
    return lib.callback.await('clearCreatedPed', null, netId)
}

function clearCreatedPeds(entities) {
    return lib.callback.await('clearCreatedPeds', null, entities)
}

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)