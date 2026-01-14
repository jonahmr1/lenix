import { modeSelected } from '../modules'
import { startCharacterProcess } from '../game'
import { openMainMenu } from '../nui'
import { playerCharacterInfo } from '../../shared/constants'

export const getCharacterPreviewData = (citizenId: string) => exports.tr_onboarding.getCharacterPreviewData(citizenId)
export const setPedAppearance = (clothes: string) => exports['illenium-appearance'].setPedAppearance(PlayerPedId(), JSON.parse(clothes))
export const loadCharacter = (citizenId: string) => exports.tr_onboarding.loadCharacter(citizenId)
export const spawnPlayer = (spawnCoords: number[]) => exports.spawnmanager.spawnPlayer({
  x: spawnCoords[0],
  y: spawnCoords[1],
  z: spawnCoords[2],
  heading: spawnCoords[3]
})
export const createNewCharacter = () => exports.tr_onboarding.createNewCharacter(null, playerCharacterInfo)
export const startGameMode = {
  competitive: () => exports.tr_competitive.startMode(),
  freeroam: () => exports.tr_freeroam.startMode(),
}
export const getPlayerCharacters = () => exports.tr_onboarding.getPlayerCharacters()

onNet('tr_onboarding/client/openMainMenu', () => openMainMenu())

const logoutPlayer = () => emitNet('tr_onboarding/server/logoutPlayer')

on('onResourceStop', (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) {
    logoutPlayer()
  }
})

globalThis.exports('logoutPlayer', logoutPlayer)
globalThis.exports('modeSelected', () => modeSelected)
globalThis.exports('startCharacterProcess', startCharacterProcess)