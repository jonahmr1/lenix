import { onNuiCallback, triggerPromise } from "@trippler/tr_lib/client"

onNuiCallback<null>("chat/focus", (_data, callback) => {
  SetNuiFocus(true, true)
  callback(true)
})

onNuiCallback<{ message: string }>("chat/createNewMessageRequest", async (data, callback) => {
  const response = await triggerPromise("createNewMessageRequest", null, data.message)  
  callback(response)
})

onNuiCallback<null>("chat/closeChat", (_data, callback) => {
  SetNuiFocus(false, false)
  callback(true)
})