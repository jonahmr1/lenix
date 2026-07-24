import createBlip from './blips'
import { createCam, destroyCam } from './camera'
import { createSinglePed, destroyCreatedPed } from './pedestrians'
import { createSingleVehicle, destroyCreatedVehicle } from './vehicles'

globalThis.exports('createBlip', createBlip)

globalThis.exports('createCam', createCam)
globalThis.exports('destroyCam', destroyCam)

globalThis.exports('createSinglePed', createSinglePed)
globalThis.exports('clearCreatedPed', destroyCreatedPed)

globalThis.exports('createSingleVehicle', createSingleVehicle)
globalThis.exports('clearCreatedVehicle', destroyCreatedVehicle)

export { default as createBlip } from './blips'
export * from './camera'
export * from './pedestrians'
export * from './vehicles'