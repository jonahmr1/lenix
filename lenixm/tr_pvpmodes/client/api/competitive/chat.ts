import { onPromise, triggerNuiCallback } from "@trippler/tr_lib/client"
import { PlayerObject } from "../../../shared/types/competitive"

onPromise('tr_pvpmodes/client/competitive/createNewMessage', async (message: string, userRole: PlayerObject) => {
  triggerNuiCallback('competitive/chat/createNewMessage', message, userRole)
})