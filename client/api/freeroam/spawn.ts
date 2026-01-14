import { spawn } from "../../../shared/constants/freeroam"
import { getSpawnCoords, logoutPlayer } from "../../modules/freeroam/spawn"

on('onResourceStop', (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    logoutPlayer()
  }
})

globalThis.exports('startMode', async () => {
  globalThis.exports.tr_onboarding.startCharacterProcess(spawn.creationSpawnCoords, getSpawnCoords())
})