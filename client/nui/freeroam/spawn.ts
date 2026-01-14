import { onNuiCallback, triggerNuiCallback } from "@trippler/tr_lib/client"
import { logoutPlayer } from "../../modules/freeroam/spawn"

export const openEscapeMenu = () => {
  triggerNuiCallback('spawn/openEscapeMenu')
}

onNuiCallback<null>('leaveFreeroam', (_data, callback) => {
  logoutPlayer()
  callback(true)
})