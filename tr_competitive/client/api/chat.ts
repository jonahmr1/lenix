import { onPromise, triggerNuiCallback } from "@trippler/tr_lib/client"
import { PlayerObject } from "../../shared/types"

onPromise('createNewMessage', async (message: string, userRole: PlayerObject) => {
  triggerNuiCallback('chat/createNewMessage', message, userRole)
})