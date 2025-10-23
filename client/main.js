RegisterNuiCallback('nuiReady', function(data, cb) {
  cb(true);
  
  exports('show', function(key, text) {
    let localKey
    localKey = key != undefined || key != '' ? key : undefined

    SendNuiMessage(JSON.stringify({
      action: "show",
      key: localKey,
      text: text
    }))
  })

  exports("hide", function() {
    SendNuiMessage(JSON.stringify({
      action: "hide"
    }))
  })
})