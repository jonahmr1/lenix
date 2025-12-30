import { control, triggerNuiCallback } from "@trippler/tr_lib/client"

control.onDisabled('T', () => {
  triggerNuiCallback('open')
  SetNuiFocus(true, false)
})