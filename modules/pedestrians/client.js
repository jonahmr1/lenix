onNet('getPedScenario', (ped, scenario) => {
    try {
        TaskStartScenarioInPlace(ped, scenario.name, scenario.timeToLeave, scenario.playIntroClip);
    } catch (error) {
        console.error(`Failed to set scenario: ${error}`);
    }
});

onNet('tr_kit:setEntityAsNoLongerNeeded', (entity) => {
    SetEntityAsNoLongerNeeded(entity)
})

onNet('tr_kit:setBlockingOfNonTemporaryEvents', (entity) => {
    SetBlockingOfNonTemporaryEvents(entity, true)
    TaskSetBlockingOfNonTemporaryEvents(entity, true)
})

lib.callback.register('requestPedModel', 1000, async function(model) {
    RequestModel(model);
    while (!HasModelLoaded(model)) {
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    return true;
});

function createSinglePed(settings) {
    return lib.callback.await('createSinglePed', 1000, settings)
}

function createMultiplePeds(peds, defaultSettings) {
    return lib.callback.await('createMultiplePeds', null, peds, defaultSettings)
}

function clearCreatedPed(entity) {
    return lib.callback.await('clearCreatedPed', null, entity)
}

function clearCreatedPeds(entities) {
    return lib.callback.await('clearCreatedPeds', null, entities)
}

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)