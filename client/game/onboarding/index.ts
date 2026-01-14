import { createPlayerNewCharacter, getPlayerCharacterCitizenId, loadPlayerCharactersPed, onPlayerLoaded, openAppearanceMenu, preparePlayerCharacterPed, spawnPlayerPed } from "../../modules/onboarding"
import { closeMainMenu } from "../../nui/onboarding"
import { everyScalar } from "../../modules"

export const startCharacterProcess = async (passedOnCreationFinishCoords?: number[], passedSpawnCoords?: number[], onClothingMenuOpen?: Function, onSubmitOrCancel?: Function) => {
  const citizenId = await getPlayerCharacterCitizenId()
  if (citizenId) {
    const [clothes, model] = await preparePlayerCharacterPed(citizenId)
    const spawnCoords = everyScalar(passedSpawnCoords, true)
    if (!spawnCoords) return

    loadPlayerCharactersPed(model, clothes, citizenId)
    spawnPlayerPed(spawnCoords)
    closeMainMenu()
  } else {
    const onCreationFinishCoords = everyScalar(passedOnCreationFinishCoords)
    if (!onCreationFinishCoords) return
    
    spawnPlayerPed(onCreationFinishCoords)
    await createPlayerNewCharacter()
    onPlayerLoaded()
    openAppearanceMenu(onClothingMenuOpen, onSubmitOrCancel)
  }
  return true
}