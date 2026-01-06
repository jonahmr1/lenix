import { createInteractions, createPeds } from "./modules"
import { setState } from "./states"

export const Initialization = (currentJob: unknown) => {
  setState.playerJob(currentJob)
  createPeds()
  createInteractions()
}

export const IsZoneFree = (zone: unknown) => {
  const response = exports.tr_lib.init().isZoneClear(zone, 2, [ PlayerPedId() ])
  return response
}