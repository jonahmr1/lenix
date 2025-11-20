setInterval(() => {
  if (NetworkIsSessionStarted()) {
    SendNuiMessage(JSON.stringify({
      action: 'init'
    }))
  }
}, 500)