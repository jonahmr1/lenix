"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@trippler/tr_lib/shared/console/index.js
var trace, fatal;
var init_console = __esm({
  "node_modules/@trippler/tr_lib/shared/console/index.js"() {
    trace = (...parameters) => {
      console.trace(...parameters);
    };
    fatal = (...parameters) => {
      console.error(...parameters);
    };
  }
});

// node_modules/@trippler/tr_lib/server/promise/onPromise/index.js
var promises, onPromise_default;
var init_onPromise = __esm({
  "node_modules/@trippler/tr_lib/server/promise/onPromise/index.js"() {
    init_console();
    promises = [];
    onNet("__tr_promise_on_self_server_lua_backward_compatibility", (endpoint) => {
      promises.push(endpoint);
    });
    onPromise_default = (endpoint, Function) => {
      if (typeof endpoint !== "string")
        return false;
      if (promises.includes(endpoint)) {
        fatal(`server promise '${endpoint}' is already defined`);
        return false;
      }
      if (typeof Function !== "function")
        return false;
      promises.push(endpoint);
      emitNet("__tr_promise_on_self_server_ts_backward_compatibility", -1, endpoint);
      onNet(`__tr_promise_on:${endpoint}`, (promiseId, ...parameters) => {
        const clientSource = source;
        try {
          const result = Function(clientSource, ...parameters);
          emitNet(`__tr_promise_trigger:${endpoint}`, source, promiseId, result);
        } catch (error) {
          emitNet(`__tr_promise_trigger:${endpoint}`, source, promiseId);
          console.trace(`server promise '${endpoint}' (client id: ${source}) threw error: ${error}`);
        }
      });
      return true;
    };
  }
});

// node_modules/@trippler/tr_lib/server/promise/triggerPromise/index.js
var init_triggerPromise = __esm({
  "node_modules/@trippler/tr_lib/server/promise/triggerPromise/index.js"() {
    init_console();
  }
});

// node_modules/@trippler/tr_lib/server/index.js
var init_server = __esm({
  "node_modules/@trippler/tr_lib/server/index.js"() {
    init_onPromise();
    init_triggerPromise();
    init_console();
  }
});

// src/server/vehicles/index.ts
var require_vehicles = __commonJS({
  "src/server/vehicles/index.ts"(exports2) {
    "use strict";
    init_server();
    var bridge = {
      getPlayerData: (source2) => {
        const playerData = exports2["qb-core"].GetCoreObject().Functions.GetPlayer(source2).PlayerData;
        return { license: playerData.license, citizenid: playerData.citizenid };
      },
      SQL_Register: async (source2, model, hash, mods, plate) => {
        const coreReady = GetResourceState("qb-core") == "started";
        const SQL_Ready = GetResourceState("oxmysql") == "started";
        if (!coreReady || !SQL_Ready) {
          trace("qb-core or oxmysql is not started, cannot register vehicle");
          return false;
        }
        const playerData = bridge.getPlayerData(source2);
        const response = await exports2.oxmysql.insert_async("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)", [
          playerData.license,
          playerData.citizenid,
          model,
          hash,
          mods,
          plate,
          0
        ]);
        return response;
      }
    };
    onPromise_default("registerCreatedVehicle", async (source2, model, hash, mods, plate) => {
      const response = await bridge.SQL_Register(source2, model, hash, mods, plate);
      if (!response) {
        trace("Failed to register the vehicle for the player with the id of: " + source2);
        return false;
      }
      return true;
    });
  }
});

// src/server/index.ts
var import_vehicles = __toESM(require_vehicles());
