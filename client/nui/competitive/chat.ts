import { onNuiCallback, triggerPromise } from "@trippler/tr_lib/client"

onNuiCallback<{ message: string }>("competitive/chat/createNewMessageRequest", async (data, callback) => callback(await triggerPromise("tr_pvpmodes/server/competitive/createNewMessageRequest", null, data.message)))