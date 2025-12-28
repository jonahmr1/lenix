"use strict";
(() => {
  // src/client/blips/index.ts
  var blips_default = (coords, icon) => {
    const blipHandle = AddBlipForCoord(coords[0], coords[1], coords[2]);
    SetBlipSprite(blipHandle, icon);
    on("onResourceStop", function(resourceName) {
      if (resourceName === GetCurrentResourceName()) {
        RemoveBlip(blipHandle);
      }
    });
    return blipHandle;
  };

  // src/client/camera/index.ts
  var createCam = (settings) => {
    const coords = settings.coords;
    const rotation = settings.rotation;
    const details = {
      fov: settings?.details?.fov ?? 40,
      fadeOut: settings?.details?.fadeOut ?? 0,
      fadeIn: settings?.details?.fadeIn ?? 0,
      delay: settings?.details?.delay ?? 0,
      rotationOrder: settings?.details?.rotationOrder ?? 0
    };
    DoScreenFadeOut(details.fadeOut);
    const camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", coords[0], coords[1], coords[2], rotation.vertical, rotation.horizontal, coords[3], details.fov, false, details.rotationOrder);
    setTimeout(() => {
      SetCamActive(camHandle, true);
      RenderScriptCams(true, true, details.delay, true, true);
      DoScreenFadeIn(details.fadeIn);
    }, details.delay);
    return camHandle;
  };
  var destroyCam = (settings) => {
    const handle = settings.handle;
    const details = {
      fadeOut: settings?.details?.fadeOut ?? 0,
      fadeIn: settings?.details?.fadeIn ?? 0,
      delay: settings?.details?.delay ?? 0
    };
    DoScreenFadeOut(details.fadeOut);
    setTimeout(() => {
      RenderScriptCams(false, false, details.delay, true, true);
      SetCamActive(handle, false);
      DoScreenFadeIn(details.fadeIn);
    }, details.delay);
  };

  // node_modules/@trippler/tr_lib/shared/console/index.js
  var trace = (...parameters) => {
    console.trace(`^6`, ...parameters, "^0");
  };
  var info = (...parameters) => {
    console.info(`^5`, ...parameters, "^0");
  };
  var fatal = (...parameters) => {
    throw new Error(...parameters);
  };

  // src/client/pedestrians/validators.ts
  var isValidCoords = (coords) => {
    if (Array.isArray(coords) && coords.length === 4)
      return true;
    else
      return false;
  };
  var validateInputs = (coords, hash) => {
    if (typeof hash !== "number") {
      fatal(`Expecter a number of hash, got ${typeof hash}(${hash})`);
      return;
    }
    if (!isValidCoords(coords)) {
      fatal(`expected array of number with length of 4, got ${typeof coords}(${coords})`);
      return;
    }
    return true;
  };

  // node_modules/@trippler/tr_lib/client/promise/onPromise/index.js
  var promises = [];
  onNet("__tr_promise_on_self_client_lua_backward_compatibility", (endpoint) => {
    promises.push(endpoint);
  });

  // node_modules/@trippler/tr_lib/client/request/index.js
  var request_default = (hash, timeout) => exports.tr_lib.init().requestModel(hash, timeout);

  // node_modules/@trippler/tr_lib/client/existing/index.js
  var existing_default = (entityHandle, netId, timeout) => exports.tr_lib.init().awaitInstanceExisting(entityHandle, netId, timeout);

  // node_modules/@trippler/tr_lib/client/promise/triggerPromise/index.js
  var pendingPromises = {};
  var patienceLimit = 5e3;
  var promises2 = [];
  var promiseId = 0;
  var triggerPromise = async (options, endpoint, ...parameters) => {
    if (typeof options === "string") {
      return triggerPromise([patienceLimit, false], options, endpoint, ...parameters);
    }
    if (typeof options === "number") {
      return triggerPromise([options, false], endpoint, ...parameters);
    }
    if (typeof options === "boolean") {
      return triggerPromise([patienceLimit, options], endpoint, ...parameters);
    }
    const timeout = options?.[0] ?? patienceLimit;
    const debug = options?.[1] ?? false;
    const promise = () => {
      return new Promise((resolve) => {
        promiseId = promiseId + 1;
        const currentPromiseId = promiseId;
        pendingPromises[currentPromiseId] = { resolve };
        const responseEvent = `__tr_promise_trigger:${endpoint}`;
        if (!promises2.includes(endpoint)) {
          promises2.push(endpoint);
          onNet(responseEvent, (selfpromiseId, response2) => {
            if (pendingPromises[selfpromiseId]) {
              pendingPromises[selfpromiseId].resolve({ success: true, returned: response2 });
              delete pendingPromises[selfpromiseId];
            }
          });
        }
        emitNet(`__tr_promise_on:${endpoint}`, currentPromiseId, ...parameters);
        setTimeout(() => {
          if (pendingPromises[currentPromiseId]) {
            pendingPromises[currentPromiseId].resolve({ success: false });
            delete pendingPromises[currentPromiseId];
          }
        }, timeout);
      });
    };
    const response = await promise();
    if (response.success) {
      if (debug) {
        trace(`server promise ${endpoint} returned ${Object.keys(response.returned).length} values`);
      }
      return response.returned;
    } else {
      if (debug) {
        trace(`server promise ${endpoint} timed out after ${timeout}ms, possible slow respose or promise does not exist`);
      }
    }
    return null;
  };

  // src/client/pedestrians/wrappers.ts
  var spawnPedEntity = async (hash, timeout, coords) => {
    const response = await request_default(hash, timeout);
    if (!response)
      return;
    const entityHandle = CreatePed(0, hash, coords[0], coords[1], coords[2], coords[3], true, true);
    const [entity, netId] = await existing_default(entityHandle, null, timeout);
    if (!netId || !entity)
      return;
    return [entity, netId];
  };
  var applyScenario = (entityHandle, scenario) => {
    scenario?.name && TaskStartScenarioInPlace(entityHandle, scenario.name, scenario?.timeToLeave, scenario?.playIntroClip);
    scenario?.freeze && FreezeEntityPosition(entityHandle, true);
    scenario?.oblivious && SetBlockingOfNonTemporaryEvents(entityHandle, true);
  };

  // src/client/pedestrians/index.ts
  var deletedPeds = /* @__PURE__ */ new Set();
  var createSinglePed = async (settings, timeout) => {
    const hash = settings.hash;
    const scenario = settings?.scenario;
    let coords = settings.coords;
    if (!validateInputs(coords, hash))
      return;
    const result = await spawnPedEntity(hash, timeout, coords);
    if (!result)
      return;
    const [entityHandle, entityNetId] = result;
    if (!entityHandle)
      return;
    if (scenario) {
      applyScenario(entityHandle, scenario);
    }
    on("onResourceStop", async (resourceName) => {
      if (GetCurrentResourceName() == resourceName) {
        trace(`${resourceName} caught stopping, clearing ped (netId: ${entityNetId})`);
        SetEntityAsNoLongerNeeded(entityHandle);
        destroyCreatedPed(entityNetId, timeout);
      }
    });
    return [entityHandle, entityNetId];
  };
  var destroyCreatedPed = async (netId, timeout) => {
    if (typeof netId !== "number") {
      info(`expected a number at #1, got ${typeof netId}`);
      return false;
    }
    if (deletedPeds.has(netId)) {
      trace(`Ped ${netId} already deleted, skipping`);
      return true;
    }
    try {
      const [entity, existingNetId] = await existing_default(null, netId, timeout);
      if (!entity) {
        info(`Entity ${existingNetId} does not exist`);
        return false;
      } else {
        DeleteEntity(entity);
        deletedPeds.add(existingNetId);
        return true;
      }
    } catch (error) {
      fatal(`Error in clearCreatedPed`, error);
      return false;
    }
  };

  // src/client/vehicles/wrappers.ts
  var bridge = {
    giveKey: (plate) => {
      emitNet("qb-vehiclekeys:server:AcquireVehicleKeys", plate);
    },
    setFuel: (handle, fuel) => {
      const entity = Entity(handle);
      if (entity) {
        entity.state.fuel = fuel;
      }
    }
  };
  var preCreateVehicle = (netId) => {
    const entity = NetworkGetEntityFromNetworkId(netId);
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        SetEntityAlpha(entity, 51, false);
        setTimeout(() => {
          SetEntityAlpha(entity, 102, false);
        }, 100);
      }, i * 200);
    }
    setTimeout(() => {
      ResetEntityAlpha(entity);
    }, 2e3);
  };
  var spawnVehicleEntity = async (entityHash, spawnCoords) => {
    const response = await request_default(entityHash, 1e3);
    if (!response)
      fatal("failed to load the model with hash of: " + entityHash);
    const entityHandle = CreateVehicle(entityHash, spawnCoords[0], spawnCoords[1], spawnCoords[2], spawnCoords[3], true, true);
    const [newEntityHandle, entityNetId] = await existing_default(entityHandle);
    if (!entityNetId)
      return;
    return [newEntityHandle, entityNetId];
  };
  var applySettings = async ({
    warp,
    preCreate,
    handle,
    plate,
    giveKey,
    fuelAmount,
    engine,
    customize
  }) => {
    const [entityHandle, existingNetId] = await existing_default(handle, warp?.netId);
    plate && SetVehicleNumberPlateText(handle, plate);
    plate && giveKey && bridge.giveKey(plate);
    fuelAmount && bridge.setFuel(handle, fuelAmount);
    engine && SetVehicleEngineOn(handle, true, engine.instantly, engine.disableAutoStart);
    if (preCreate && existingNetId) {
      preCreateVehicle(existingNetId);
    }
    if (warp && entityHandle) {
      TaskWarpPedIntoVehicle(entityHandle, handle, warp.seat);
    }
    if (customize) {
      SetVehicleCustomPrimaryColour(handle, customize[0], customize[1], customize[2]);
      SetVehicleCustomSecondaryColour(handle, customize[0], customize[1], customize[2]);
      SetVehicleLivery(handle, customize[3].livery);
      SetVehicleMod(handle, 48, customize[3].livery, false);
    }
  };

  // src/client/vehicles/index.ts
  var deletedVehicles = /* @__PURE__ */ new Set();
  var createSingleVehicle = async (settings) => {
    const entityHash = settings.hash;
    const entityModel = GetDisplayNameFromVehicleModel(entityHash);
    const preCreateEntity = settings?.preCreate;
    const vehiclePlate = settings?.plate;
    const giveVehicleKey = settings?.giveKey;
    const setFuelAmount = settings?.fuelAmount;
    const customizeVehicle = settings?.customize;
    const registerOwnedVehicle = settings?.register;
    const warpIntoVehicle = {
      entityNetId: settings?.warp?.netId,
      seat: settings?.warp?.seat
    };
    const vehicleEngine = {
      instantly: settings?.engine?.instantly,
      disableAutoStart: settings?.engine?.disableAutoStart
    };
    const spawnCoords = settings.coords;
    const result = await spawnVehicleEntity(entityHash, spawnCoords);
    if (!result)
      return;
    const [entityHandle, entityNetId] = result;
    if (!entityNetId)
      return;
    if (registerOwnedVehicle) {
      const response = await triggerPromise("registerCreatedVehicle", null, entityModel, entityHash, null, vehiclePlate);
      if (!response) {
        trace("Failed to register the vehicle");
        destroyCreatedVehicle(entityNetId);
        return [false, false];
      }
    }
    applySettings({
      warp: warpIntoVehicle,
      preCreate: preCreateEntity,
      handle: entityHandle,
      plate: vehiclePlate,
      giveKey: giveVehicleKey,
      fuelAmount: setFuelAmount,
      engine: vehicleEngine,
      customize: customizeVehicle
    });
    on("onResourceStop", (resourceName) => {
      if (GetCurrentResourceName() == resourceName) {
        trace(`${resourceName} caught stopping, clearing vehicle ${entityNetId}`);
        destroyCreatedVehicle(entityNetId);
      }
    });
    return [entityHandle, entityNetId];
  };
  var destroyCreatedVehicle = async (netId) => {
    if (typeof netId !== "number") {
      trace(`expected a number at #1, got ${typeof netId}`);
      return false;
    }
    if (deletedVehicles.has(netId)) {
      trace(`Vehicle ${netId} already deleted, skipping`);
      return true;
    }
    const [vehicle, existingNetId] = await existing_default(null, netId);
    if (!vehicle) {
      info(`Vehicle ${netId} does not exist`);
      return false;
    }
    DeleteEntity(vehicle);
    deletedVehicles.add(netId);
    return true;
  };

  // src/client/index.ts
  globalThis.exports("createBlip", blips_default);
  globalThis.exports("createCam", createCam);
  globalThis.exports("destroyCam", destroyCam);
  globalThis.exports("createSinglePed", createSinglePed);
  globalThis.exports("clearCreatedPed", destroyCreatedPed);
  globalThis.exports("createSingleVehicle", createSingleVehicle);
  globalThis.exports("clearCreatedVehicle", destroyCreatedVehicle);
})();
