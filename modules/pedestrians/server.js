const lib = exports.tr_lib.require('@tr_lib/get')

function createSinglePed(model, coords, scenario, isAccessPublic, isControlPublic) {
    console.log(coords);
    if (typeof model !== 'string') {
        lib.print.debug(`wrong type on the first argument, expected string of hash received ${typeof model} or ${model} indeed`)
    }
    if (
        typeof coords !== 'object' ||
        coords == null ||
        coords.x == null || coords.y == null ||
        coords.z == null || coords.w == null
    ) {
        lib.print.err(`wrong type or missing a value on the second argument, (type: ${typeof coords}, values: x:${coords?.x}, y:${coords?.y}, z:${coords?.z}, w:${coords?.w})`)
        return;
    }

    const ped = CreatePed(null, model || 'ig_talcc', coords.x, coords.y, coords.z, coords.w, !!isAccessPublic, !!isAccessPublic && !isControlPublic);
    if (typeof scenario === 'object' && scenario != null) {
        emitNet('getPedScenario', -1, ped, scenario);
    }
    on('onResourceStop', (resourceName) => {
        if (GetCurrentResourceName() == resourceName) {
            clearCreatedPed(ped)
        }
    })
    return ped;
}

function createMultiplePeds(peds, defaultSettings) {
    if (!Array.isArray(peds) || peds.length === 0) {
        lib.print.err('expected an array of peds, received data will not be processed')
        return [];
    }

    const created = [];
    for (let i = 0; i < peds.length; i++) {
        const ped = peds[i];
        if (!ped || typeof ped.model !== 'string') {
            ped.model = defaultSettings.model;
        }
        const coords = ped.coords;
        if (!coords || coords.x == null || coords.y == null || coords.z == null || coords.w == null) {
            lib.print.debug(`unproper vector received for ped index number ${i} with x:${coords.x}, y:${coords.y}, z:${coords.z}, w:${coords.w}`);
            continue;
        }

        if (typeof ped.scenario !== 'object') {
            ped.scenario = defaultSettings.scenario;
        }
        
        if (ped.isAccessPublic == null) {
            ped.isAccessPublic = defaultSettings.isAccessPublic;
        }
        
        if (ped.isControlPublic == null) {
            ped.isControlPublic = defaultSettings.isControlPublic;
        }

        const createdPed = createSinglePed(ped.model, coords, ped.scenario, ped.isAccessPublic, ped.isControlPublic);
        if (createdPed) created.push(createdPed);
    }

    return created;
}

function clearCreatedPed(entity) {
    if (typeof entity !== 'number') {
        lib.print.debug(`received ${typeof entity} instead of a number, if you passed an array of number to delete multiple peds, please use clearCreatedPeds instead of clearCreatePeds`)
    }
    DeleteEntity(entity);
}

function clearCreatedPeds(entities) {
    if (!Array.isArray(entities)) {
        lib.print.debug(`received ${typeof entities} instead of array, use clearCreatedPed for single ped`)
    }

    for (let i = 0; i < entities.length; i++) {
        DeleteEntity(entities[i]);
    }
}

lib.callback.register('createSinglePed', function(model, coords, scenario, isAccessPublic, isControlPublic) {
    return createSinglePed(model, coords, scenario, isAccessPublic, isControlPublic)
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