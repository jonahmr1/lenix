import { onNuiCallback, triggerPromise } from "@trippler/tr_lib/client"

onNuiCallback<{ message: string }>("chat/createNewMessageRequest", async (data, callback) => callback(await triggerPromise("createNewMessageRequest", null, data.message)))