RegisterNuiCallback('contentLoaded', (_, cb) => {
  const interval = setInterval(() => {
    if (NetworkIsSessionStarted()) {
      SetNuiFocus(true, false)
      SendNuiMessage(JSON.stringify({
        action: 'init'
      }))
      cb(true)
      clearInterval(interval)
    }
  }, 500)
})

RegisterNuiCallback('loseFocus', (_, cb) => {
  SetNuiFocus(false, false)
  cb(true)
})