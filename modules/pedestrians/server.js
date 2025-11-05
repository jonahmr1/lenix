let clearedPeds = []

async function requestLoadResponse(model) {
    try {
        const response = await lib.callback.await('requestPedModel', -1, 1000, model);
        if (!response) {
            console.error(`Failed to load model: ${model}`);
        }
        return response;
    } catch (error) {
        console.error(`Error in requestLoadResponse for model ${model}: ${error.message}`);
        return false;
    }
}

async function createSinglePed(settings) {
    const caller = GetInvokingResource()
    const model = settings.model;
    const coords = settings.coords;
    const scenario = settings.scenario;
    const isAccessPublic = settings.isAccessPublic;
    const isControlPublic = settings.isControlPublic;

    const isNotValidCoords = (typeof coords !== 'object' && Object.keys(coords).length !== 4) || (!Array.isArray(coords) && coords.length !== 4)

    if (typeof model !== 'string') {
        console.log(`wrong type on the first argument, expected string of hash received ${typeof model} or ${model} indeed`)
        return;
    }
    if (isNotValidCoords) {
        console.error(`wrong type or missing a value on the second argument, (type: ${typeof coords}, values: x:${coords?.x || coords[0]}, y:${coords[1]}, z:${coords[2]}, w:${coords[3]})`)
        return;
    }

    const response = await requestLoadResponse(model)
    if (response) {
        const ped = CreatePed(null, model, coords.x, coords.y, coords.z, coords.w, !!isAccessPublic, !!isAccessPublic && !isControlPublic);
        if (typeof scenario === 'object' && scenario != null) {
            emitNet('tr_kit:setEntityAsNoLongerNeeded', -1, ped);
        }
        if (scenario) {
            if (scenario.freeze) FreezeEntityPosition(ped, true);
            if (scenario.oblivious) emitNet('tr_kit:setBlockingOfNonTemporaryEvents', -1, ped);
        }

        on('onResourceStop', async (resourceName) => {
            if (clearedPeds.includes(ped)) return;
            if (caller == resourceName || GetCurrentResourceName() == resourceName) {
                console.log(`${resourceName} caught stopping, clearing ped ${ped}`)
                clearCreatedPed(ped)
                clearedPeds.push(ped)
                await new Promise(resolve => setTimeout(resolve, 0))
                emitNet('setEntityAsNoLongerNeeded', -1, ped)
            }
        })
        return ped;
    }
    return false
}

function createMultiplePeds(peds, defaultSettings) {
    if (!Array.isArray(peds) || peds.length === 0) {
        console.error('expected an array of peds, received data will not be processed')
        return [];
    }

    const created = [];
    for (let i = 0; i < peds.length; i++) {
        const ped = peds[i];

        const model = ped.model ?? defaultSettings?.model;
        const coords = ped.coords;
        const isAccessPublic = ped.isAccessPublic ?? defaultSettings?.isAccessPublic;
        const isControlPublic = ped.isControlPublic ?? defaultSettings?.isControlPublic;

        const scenario = {
            name: ped.scenario?.name ?? defaultSettings?.scenario?.name,
            freeze: ped.scenario?.freeze ?? defaultSettings?.scenario?.freeze,
            timeToLeave: ped.scenario?.timeToLeave ?? defaultSettings?.scenario?.timeToLeave,
            playIntroClip: ped.scenario?.playIntroClip ?? defaultSettings?.scenario?.playIntroClip
        };

        const createdPed = createSinglePed({ 
            model, 
            coords, 
            scenario, 
            isAccessPublic, 
            isControlPublic 
        });
        
        if (createdPed) created.push(createdPed);
    }
    return created;
}

function clearCreatedPed(entity) {
    if (typeof entity !== 'number') {
        console.log(`received ${typeof entity} instead of a number, if you passed an array of number to delete multiple peds, please use clearCreatedPeds instead of clearCreatePeds`)
    }
    DeleteEntity(entity);
    return true
}

function clearCreatedPeds(entities) {
    if (!Array.isArray(entities)) {
        console.log(`received ${typeof entities} instead of array, use clearCreatedPed for single ped`)
    }

    for (let i = 0; i < entities.length; i++) {
        DeleteEntity(entities[i]);
    }
    return true
}

lib.callback.register('createSinglePed', function(settings) {
    return createSinglePed(settings)
})

lib.callback.register('createMultiplePeds', function(peds, defaultSettings) {
    return createMultiplePeds(peds, defaultSettings)
})

lib.callback.register('clearCreatedPed', function(entity) {
    return clearCreatedPed(entity)
})

lib.callback.register('clearCreatedPeds', function(entities) {
    return clearCreatedPeds(entities)
})

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)