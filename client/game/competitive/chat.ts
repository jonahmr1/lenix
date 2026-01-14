import { control, triggerNuiCallback } from "@trippler/tr_lib/client"
import { modeSelected } from "../../modules/onboarding"

control.onDisabled('T', () => {
  if (modeSelected !== 'competitive') return 
  triggerNuiCallback('competitive/chat/openChat')
})