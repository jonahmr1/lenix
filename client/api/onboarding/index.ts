import { openMainMenu } from '../../nui/onboarding'
import { playerCharacterInfo } from '../../../shared/constants/onboarding'

export const setPedAppearance = (clothes: string) => exports['illenium-appearance'].setPedAppearance(PlayerPedId(), JSON.parse(clothes))
export const spawnPlayer = (spawnCoords: number[]) => exports.spawnmanager.spawnPlayer({
  x: spawnCoords[0],
  y: spawnCoords[1],
  z: spawnCoords[2],
  heading: spawnCoords[3]
})
export const loadCharacter = (citizenId: string) => exports[GetCurrentResourceName()].loadCharacter(citizenId)
export const getCharacterPreviewData = (citizenId: string) => exports[GetCurrentResourceName()].getCharacterPreviewData(citizenId)
export const createNewCharacter = () => exports[GetCurrentResourceName()].createNewCharacter(null, playerCharacterInfo)
export const getPlayerCharacters = () => exports[GetCurrentResourceName()].getPlayerCharacters()

onNet('tr_pvpmodes/client/onboarding/openMainMenu', openMainMenu)

export const logoutPlayer = () => emitNet('tr_pvpmodes/server/onboarding/logoutPlayer')

on('onResourceStop', (resourceName: string) => {
  if (resourceName === GetCurrentResourceName()) logoutPlayer()
})