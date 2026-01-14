import { onNuiCallback, triggerNuiCallback } from "@trippler/tr_lib/client"
import { selecteGameMode } from "../../modules/onboarding"

onNuiCallback<{ mode: string }>('selectMode', (data, callback) => {
  selecteGameMode(data.mode)
  callback(true)
})

export const openMainMenu = () => triggerNuiCallback('onboarding/openMainMenu')
export const closeMainMenu = () => triggerNuiCallback('onboarding/closeMainMenu')