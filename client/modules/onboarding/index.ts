import { fatal, trace } from "@trippler/tr_lib/shared"
import { createNewCharacter, getCharacterPreviewData, getPlayerCharacters, loadCharacter, setPedAppearance, spawnPlayer, startGameMode } from "../../api/onboarding"
import { closeMainMenu } from "../../nui/onboarding"

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

export const spawnPlayerPed = (spawnCoords: number[]) => {
  spawnPlayer(spawnCoords)
}

export const createPlayerNewCharacter = async () => {
  const newCreatedCharacter = await createNewCharacter()
  if (!newCreatedCharacter) {
    trace('Lenix got no idea why this is failing')
  }
}

export const openAppearanceMenu = (onClothingMenuOpen: Function, onSubmitOrCancel: Function) => {
  onClothingMenuOpen && onClothingMenuOpen()
  emit('qb-clothes:client:CreateFirstCharacter', onSubmitOrCancel, onSubmitOrCancel)
}

export const selecteGameMode = (mode: string) => {
  if (mode === 'competitive') {
    if (GetResourceState('tr_competitive') !== 'started') fatal('tr_competitive is not started')
    const delayToCloseDashboard = startGameMode.competitive()
    if (delayToCloseDashboard) 
    setTimeout(() => closeMainMenu(), delayToCloseDashboard)
    modeSelected = mode
  } else if (mode === 'freeroam') {
    if (GetResourceState('tr_freeroam') !== 'started') fatal('tr_freeroam is not started')
    startGameMode.freeroam()
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