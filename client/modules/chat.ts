

control.onDisabled('T', () => {
  triggerNuiCallback({ action: 'open' })
  SetNuiFocus(true, false)
})