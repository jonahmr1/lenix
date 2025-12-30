import { onNuiCallback, triggerPromise } from "@trippler/tr_lib/client"

onNuiCallback<null>("focus", (_data, callback) => {
  SetNuiFocus(true, true)
  callback(true)
})

onNuiCallback<{ message: string }>("createNewMessageRequest", async (data, callback) => {
  const response = await triggerPromise("createNewMessageRequest", null, data.message)  
  callback(response)
})

onNuiCallback<null>("closeChat", (_data, callback) => {
  SetNuiFocus(false, false)
  callback(true)
})