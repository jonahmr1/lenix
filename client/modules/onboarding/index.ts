import { fatal, trace } from "@trippler/tr_lib/shared"
import { createNewCharacter, getCharacterPreviewData, getPlayerCharacters, loadCharacter, setPedAppearance, spawnPlayer } from "../../api/onboarding"
import { closeMainMenu } from "../../nui/onboarding"
import { openGame } from "../../game/competitive/dashboard"
import { startCharacterProcess } from "../../game/onboarding"
import { spawn } from "../../../shared/constants/freeroam"
import { getSpawnCoords } from "../freeroam/spawn"

export let modeSelected: string | undefined

export const onPlayerLoaded = () => {
  emitNet('QBCore:Server:OnPlayerLoaded')
  emit('QBCore:Client:OnPlayerLoaded')
}

export const preparePlayerCharacterPed = async (citizenId: string) => {
  const [ clothes, model ] = await getCharacterPreviewData(citizenId)

  RequestModel(model)
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (HasModelLoaded(model)) {
        clearInterval(interval)
        resolve()
      }
    }, 1000)
  })
  return [ clothes, model ]
}

export const loadPlayerCharactersPed = async (model: string, clothes: string, citizenId: string) => {
  SetPlayerModel(PlayerId(), model)
  setPedAppearance(clothes)
  SetModelAsNoLongerNeeded(model)
  loadCharacter(citizenId)
  onPlayerLoaded()
}

export const createPlayerNewCharacter = async () => {
  const newCreatedCharacter = await createNewCharacter()
  if (!newCreatedCharacter) {
    trace('Lenix got no idea why this is failing')
  }
}

export const openAppearanceMenu = (onClothingMenuOpen?: Function, onSubmitOrCancel?: Function) => {
  onClothingMenuOpen && onClothingMenuOpen()
  emit('qb-clothes:client:CreateFirstCharacter', onSubmitOrCancel, onSubmitOrCancel || (() => {}))
}

export const selecteGameMode = (mode: string) => {
  if (mode === 'competitive') {
    const delayToCloseDashboard = openGame()
    if (delayToCloseDashboard) 
    setTimeout(() => closeMainMenu(), delayToCloseDashboard)
    modeSelected = mode
  } else if (mode === 'freeroam') {
    const coords = getSpawnCoords()
    if (!coords) fatal('No spawn coords found')
    startCharacterProcess(spawn.creationSpawnCoords, coords)
    modeSelected = mode
  }
}

export const getPlayerCharacterCitizenId = async () => {
  const characters = await getPlayerCharacters()
  if (characters.length > 0) {
    return characters[0].citizenid
  } else {
    if (characters.length === 0) return false
  }
}