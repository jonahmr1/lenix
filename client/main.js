RegisterNuiCallback('contentLoaded', (_, cb) => {
  const interval = setInterval(() => {
    if (NetworkIsSessionStarted()) {
      SetNuiFocus(true, false)
      SendNuiMessage(JSON.stringify({
        action: 'init'
      }))
      clearInterval(interval)
    }
  }, 500)
})

RegisterNuiCallback('loseFocus', () => {
  SetNuiFocus(false, false)
})