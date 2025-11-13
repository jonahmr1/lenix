async function requestLoadResponse(model, timeout) {
    try {
        const response = await lib.callback.await('requestPedModel', null, -1, model, timeout);
        return response;
    } catch (error) {
        console.error(`Error in requestLoadResponse for model ${model}: ${error.message}`);
        return false;
    }
}

async function createSinglePed(settings) {
    const model = settings.model;
    const scenario = settings.scenario;
    let coords = settings.coords;

    const isNotValidCoords = ((typeof coords !== 'object' && Object.keys(coords).length !== 4) || (!Array.isArray(coords) && coords.length !== 4)) ? true : false

    if (typeof model !== 'string') {
        console.error(`Invalid argument: expected a string hash as the first argument, but received type "${typeof model}" with value "${model}".`)
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

    const response = await requestLoadResponse(model, 1000)
    if (!response) return;

    const handle = CreatePed(null, GetHashKey(model), coords.x, coords.y, coords.z, coords.w, true, true);
    const netId = await lib.awaitInstanceExisting(handle)
    if (!netId) return;

    if (scenario) {
        if (scenario.name) emitNet('tr_kit:client:playPedScenario', -1, netId, scenario.name, scenario?.timeToLeave, scenario?.playIntroClip);
        if (scenario.freeze) FreezeEntityPosition(handle, true);
        if (scenario.oblivious) emitNet('tr_kit:client:setBlockingOfNonTemporaryEvents', -1, netId);
    }

    on('onResourceStop', async (resourceName) => {
        if (GetCurrentResourceName() == resourceName) {
            console.log(`${resourceName} caught stopping, clearing ped (netId: ${netId})`)
            clearCreatedPed(netId)
            emitNet('tr_kit:client:setEntityAsNoLongerNeeded', -1, netId)
        }
    })
    return netId;
}

function createMultiplePeds(peds, defaultSettings) {
    if (!Array.isArray(peds) || peds.length === 0) {
        console.error('expected an array of peds, received data will not be processed')
        return [];
    }

    const netIds = [];
    for (let i = 0; i < peds.length; i++) {
        const ped = peds[i];

        const processedSettings = {
            ...defaultSettings,
            ...ped,
            scenario: {
                ...defaultSettings?.scenario,
                ...ped?.scenario
            }
        }

        const netId = createSinglePed(processedSettings);
        
        if (netId) netIds.push(netId);
    }
    return netIds;
}

async function clearCreatedPed(netId) {
    if (typeof netId !== 'number') {
        console.warn(`Invalid argument, expected a number, received ${typeof netId}`)
        return false;
    }
	const handle = await lib.callback.await(true, 'awaitNetworkExisting', null, 1, netId)
    if (!handle) {
        console.warn(`The entity with network id of ${netId} does not exist`)
        return false;
    }
    console.log(handle)
    DeleteEntity(handle);
    return true
}

async function clearCreatedPeds(entities) {
    if (!Array.isArray(entities)) {
        console.log(`Invalid argument, expected an array, received ${typeof entities}`)
        return false
    }

    for (let i = 0; i < entities.length; i++) {
	    const handle = await lib.callback.await('awaitNetworkExisting', null, -1, entities[i])
        if (!handle) {
            console.warn(`The entity with network id of ${entities[i]} does not exist`)
            continue;
        }
        DeleteEntity(handle);
    }
    return true
}

lib.callback.register('createSinglePed', function(_, settings) {
    return createSinglePed(settings)
})

lib.callback.register('createMultiplePeds', function(_, peds, defaultSettings) {
    return createMultiplePeds(peds, defaultSettings)
})

lib.callback.register('clearCreatedPed', function(_, entity) {
    return clearCreatedPed(entity)
})

lib.callback.register('clearCreatedPeds', function(_, entities) {
    return clearCreatedPeds(entities)
})

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)