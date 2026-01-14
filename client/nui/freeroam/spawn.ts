import { onNuiCallback } from "@trippler/tr_lib/client"
import { logoutPlayer } from "../../api/onboarding"

onNuiCallback<null>('leaveFreeroam', (_data, callback) => {
  logoutPlayer()
  callback(true)
})