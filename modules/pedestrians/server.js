const deletedPeds = new Set();

async function createSinglePed(source, settings) {
    const [entityHandle, netId] = lib.callback.await('createSinglePed', null, source, settings)
    return [entityHandle, netId];
}

function createMultiplePeds(source, peds, defaultSettings) {
    if (!Array.isArray(peds) || peds.length === 0) {
        console.error('expected an array of peds, received data will not be processed')
        return [];
    }

    const entityHandles = [];
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

        const [entityHandle, netId] = createSinglePed(source, processedSettings);
        
        if (netId) netIds.push(netId);
        if (entityHandle) entityHandles.push(entityHandle);
    }
    return [entityHandles, netIds];
}

async function clearCreatedPed(netId) {
    if (typeof netId !== 'number') {
        console.warn(`Invalid argument, expected a number, received ${typeof netId}`)
        return false;
    }
    if (deletedPeds.has(netId)) {
        console.log(`Ped ${netId} already deleted, skipping`);
        return true;
    }
	try {
        const result = await lib.awaitInstanceExisting(null, netId);
        
        const [entityHandle, _] = Array.isArray(result) ? result : [result, null];
        
        if (!entityHandle || entityHandle === false) {
            console.warn(`Entity ${netId} does not exist`);
            return false;
        }

        DeleteEntity(entityHandle);
        deletedPeds.add(netId);
        return true;
    } catch (error) {
        console.error(`Error in clearCreatedPed for ${netId}:`, error);
        return false;
    }
}

async function clearCreatedPeds(entities) {
    if (!Array.isArray(entities)) {
        console.log(`Invalid argument, expected an array, received ${typeof entities}`)
        return false
    }

    for (let i = 0; i < entities.length; i++) {
	    const [handle, _] = await lib.awaitInstanceExisting(entities[i])
        if (!handle) {
            console.warn(`The entity with network id of ${entities[i]} does not exist`)
            continue;
        }
        DeleteEntity(handle);
    }
    return true
}

lib.callback.register('createMultiplePeds', function(source, peds, defaultSettings) {
    return createMultiplePeds(source, peds, defaultSettings)
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