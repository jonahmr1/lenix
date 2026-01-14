import { spawn } from "../../shared/constants"

export const getSpawnCoords = () => {
  if (spawn.spawnLastLocation !== true) {
    return spawn.spawnLastLocation
  }

  const lastCoords = globalThis.exports[GetCurrentResourceName()].lastCoords()
  return [ lastCoords.x, lastCoords.y, lastCoords.z, lastCoords.w ]
}

export const logoutPlayer = () => {
  globalThis.exports.tr_onboarding.logoutPlayer()
}