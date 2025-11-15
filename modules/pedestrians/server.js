const deletedPeds = new Set();

async function createSinglePed(source, settings) {
    const [entityClientHandle, netId] = lib.callback.await('createSinglePed', null, source, settings)
    return [entityClientHandle, netId];
}

function createMultiplePeds(source, peds, defaultSettings) {
    if (!Array.isArray(peds) || peds.length === 0) {
        console.error('expected an array of peds, received data will not be processed')
        return [];
    }

    const entityClientHandles = [];
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

        const [entityClientHandle, netId] = createSinglePed(source, processedSettings);
        
        if (netId) netIds.push(netId);
        if (entityClientHandle) entityClientHandles.push(entityClientHandle);
    }
    return [entityClientHandles, netIds];
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
        
        const [entityServerHandle, _] = Array.isArray(result) ? result : [result, null];
        
        if (!entityServerHandle || entityServerHandle === false) {
            console.warn(`Entity ${netId} does not exist`);
            return false;
        }

        DeleteEntity(entityServerHandle);
        deletedPeds.add(netId);
        return true;
    } catch (error) {
        console.error(`Error in clearCreatedPed for ${netId}:`, error);
        return false;
    }
}

async function clearCreatedPeds(netIds) {
    if (!Array.isArray(netIds)) {
        console.log(`Invalid argument, expected an array, received ${typeof netIds}`)
        return false
    }

    for (let i = 0; i < netIds.length; i++) {
	    const [entityServerHandle, _] = await lib.awaitInstanceExisting(null, netIds[i])
        if (!entityServerHandle) {
            console.warn(`The entity with network id of ${netIds[i]} does not exist`)
            continue;
        }
        DeleteEntity(entityServerHandle);
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