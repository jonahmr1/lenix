const validateInputs = (coords, hash) => {
  const isNotValidCoords = ((typeof coords !== 'object' && Object.keys(coords).length !== 4) || (!Array.isArray(coords) && coords.length !== 4)) ? true : false

  if (typeof hash !== 'number') {
    lib.console.fatal(`Expecter a number of hash, got ${typeof hash}(${hash})`)
    return;
  }
  if (isNotValidCoords) {
    lib.console.fatal(
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
  return true
}

const spawnPedEntity = async (hash, timeout, coords) => {
  const response = await lib.requestModel(hash, timeout)
  if (!response) return;

  const entityHandle = CreatePed(null, hash, coords.x, coords.y, coords.z, coords.w, true, true);
  let [entity, netId] = await lib.awaitInstanceExisting(entityHandle, null, timeout)
  if (!netId || !entity) return;
  return [entity, netId]
}

const applyScenario = (entityHandle, scenario) => {
  scenario.name && TaskStartScenarioInPlace(entityHandle, scenario.name, scenario?.timeToLeave, scenario?.playIntroClip);
  scenario.freeze && FreezeEntityPosition(entityHandle, true);
  scenario.oblivious && SetBlockingOfNonTemporaryEvents(entityHandle, true);
}

async function createSinglePed(settings, timeout) {
  const hash = settings.hash;
  const scenario = settings.scenario;
  let coords = settings.coords;
  if (!validateInputs(coords, hash)) return;
  
  const [entityHandle, netId] = await spawnPedEntity(hash, timeout | 1000, coords)
  if (!entityHandle) return;
  
  if (scenario) {
    applyScenario(entityHandle, scenario)
  }

  on('onResourceStop', async (resourceName) => {
    if (GetCurrentResourceName() == resourceName) {
      lib.console.trace(`${resourceName} caught stopping, clearing ped (netId: ${netId})`)
      SetEntityAsNoLongerNeeded(entityHandle, true)
      clearCreatedPed(netId)
    }
  })
  return [entityHandle, netId]
}

lib.callback.register('createSinglePed', async (settings, timeout) => {
  return await createSinglePed(settings, timeout)
})

async function createMultiplePeds(peds, defaultSettings, timeout) {
  return await lib.callback.await('createMultiplePeds', timeout, peds, defaultSettings)
}

async function clearCreatedPed(netId, timeout) {
  return await lib.callback.await('clearCreatedPed', timeout, netId)
}

async function clearCreatedPeds(entities, timeout) {
  return await lib.callback.await('clearCreatedPeds', timeout, entities)
}

exports('createSinglePed', createSinglePed)
exports('createMultiplePeds', createMultiplePeds)
exports('clearCreatedPed', clearCreatedPed)
exports('clearCreatedPeds', clearCreatedPeds)