const interval = setInterval(() => {
  if (NetworkIsSessionStarted()) {
    SendNuiMessage(JSON.stringify({
      action: 'init'
    }))
    clearInterval(interval)
  }
}, 500)