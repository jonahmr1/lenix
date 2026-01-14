import { control, triggerNuiCallback } from "@trippler/tr_lib/client"

control.onDisabled('T', () => {
  if (globalThis.exports.tr_onboarding.modeSelected() !== 'competitive') return 
  triggerNuiCallback('chat/openChat')
})