import { trace } from "@trippler/tr_lib/shared"
import { createPlayerNewCharacter, getPlayerCharacterCitizenId, loadPlayerCharactersPed, onPlayerLoaded, openAppearanceMenu, preparePlayerCharacterPed, spawnPlayerPed } from "../modules"
import { closeMainMenu } from "../nui"

const everyScalar = (coords: [number, number, number, number] | number[], debug?: boolean) => {
  if (coords.length === 4) {
    if (coords.every(scalar => { return typeof scalar === 'number' })) {
      return coords
    } else {
      debug && trace(`expected array of numbers only, got ${coords}`)
      return false
    }
  } else {
    debug && trace(`expected array of length 4, got ${coords}`)
    return false
  }
}

export const startCharacterProcess = async (passedOnCreationFinishCoords: number[], passedSpawnCoords: number[], onClothingMenuOpen: Function, onSubmitOrCancel: Function) => {
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