import { everyScalar } from ".."
import { spawn } from "../../../shared/constants/freeroam"

export const getSpawnCoords = () => {
  if (spawn.spawnLastLocation !== true) return everyScalar(spawn.spawnLastLocation)
 
  const lastCoords = globalThis.exports[GetCurrentResourceName()].lastCoords() as { x: number, y: number, z: number, w: number } | undefined
  return everyScalar([ lastCoords?.x, lastCoords?.y, lastCoords?.z, lastCoords?.w ])
}

export const logoutPlayer = () => {
  globalThis.exports.tr_onboarding.logoutPlayer()
}