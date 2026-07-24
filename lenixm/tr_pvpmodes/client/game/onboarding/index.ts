import { createPlayerNewCharacter, getPlayerCharacterCitizenId, loadPlayerCharactersPed, onPlayerLoaded, openAppearanceMenu, preparePlayerCharacterPed } from "../../modules/onboarding"
import { closeMainMenu } from "../../nui/onboarding"
import { everyScalar } from "../../modules"
import { spawnPlayer } from "../../api/onboarding"

export const startCharacterProcess = async (passedOnCreationFinishCoords?: number[], passedSpawnCoords?: number[], onClothingMenuOpen?: Function, onSubmitOrCancel?: Function) => {
  const citizenId = await getPlayerCharacterCitizenId()
  if (citizenId) {
    const [clothes, model] = await preparePlayerCharacterPed(citizenId)
    const spawnCoords = everyScalar(passedSpawnCoords, true)
    if (!spawnCoords) return

    loadPlayerCharactersPed(model, clothes, citizenId)
    spawnPlayer()
  } else {
    const onCreationFinishCoords = everyScalar(passedOnCreationFinishCoords)
    if (!onCreationFinishCoords) return

    spawnPlayer(onCreationFinishCoords)
    await createPlayerNewCharacter()
    onPlayerLoaded()
    openAppearanceMenu(onClothingMenuOpen, onSubmitOrCancel)
  }
  closeMainMenu()
  return true
}