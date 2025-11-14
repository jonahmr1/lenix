onNet('tr_kit:client:playPedScenario', async(handle, netId, name, timeToLeave, playIntroClip) => {
    SetNetworkIdExistsOnAllMachines(netId, true);
    await new Promise(resolve => setImmediate(resolve));
    console.log(NetworkGetEntityIsNetworked(handle))
    const entity = await lib.awaitNetworkExisting(netId)
    if (!entity) return;
    TaskStartScenarioInPlace(entity, name, timeToLeave, playIntroClip);
});

onNet('tr_kit:client:setEntityAsNoLongerNeeded', async (netId) => {
    const entity = await lib.awaitNetworkExisting(netId)
    if (!entity) return;
    SetEntityAsNoLongerNeeded(entity)
})

onNet('tr_kit:client:setBlockingOfNonTemporaryEvents', async (netId) => {
    const entity = await lib.awaitNetworkExisting(netId)
    if (!entity) return;
    SetBlockingOfNonTemporaryEvents(entity, true)
})

lib.callback.register('requestPedModel', async function(model, timeout) {
    const response = await lib.requestModel(GetHashKey(model), timeout)
    return response;
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