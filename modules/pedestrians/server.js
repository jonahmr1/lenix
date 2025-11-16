const deletedPeds = new Set();

async function createSinglePed(settings, timeout) {
    const [entityClientHandle, netId] = await lib.callback.await('createSinglePed', null, lib.source, settings, timeout)
    const [entityServerHandle, _] = await lib.awaitInstanceExisting(null, netId, timeout);
    return [entityServerHandle, netId];
}

async function createMultiplePeds(peds, defaultSettings, timeout) {
    if (!Array.isArray(peds) || peds.length === 0) {
        console.error('expected an array of peds, received data will not be processed')
        return [];
    }

    const entityServerHandles = [];
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

        const [entityServerHandle, netId] = await createSinglePed(lib.source, processedSettings, timeout);
        
        if (netId) netIds.push(netId);
        if (entityServerHandle) entityServerHandles.push(entityServerHandle);
    }
    return [entityServerHandles, netIds];
}

async function clearCreatedPed(netId, timeout) {
    if (typeof netId !== 'number') {
        console.warn(`Invalid argument, expected a number, received ${typeof netId}`)
        return false;
    }
    if (deletedPeds.has(netId)) {
        console.log(`Ped ${netId} already deleted, skipping`);
        return true;
    }
	try {
        const result = await lib.awaitInstanceExisting(null, netId, timeout);
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

async function clearCreatedPeds(netIds, timeout) {
    if (!Array.isArray(netIds)) {
        console.log(`Invalid argument, expected an array, received ${typeof netIds}`)
        return false
    }

    for (let i = 0; i < netIds.length; i++) {
        await clearCreatedPed(netIds[i], timeout)
    }
    return true
}

lib.callback.register('createMultiplePeds', function(_, peds, defaultSettings, timeout) {
    return createMultiplePeds(peds, defaultSettings, timeout)
})

lib.callback.register('clearCreatedPed', function(_, entity, timeout) {
    return clearCreatedPed(entity, timeout)
})

lib.callback.register('clearCreatedPeds', function(_, entities, timeout) {
    return clearCreatedPeds(entities, timeout)
})

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)