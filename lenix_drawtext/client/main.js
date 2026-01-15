RegisterNuiCallback('nuiReady', function (data, cb) {
  cb(true)
  SendNuiMessage(JSON.stringify({
    type: 'init',
    color: primary
  }))
  let cache = {
    text: '',
    icon: '',
    key: ''
  }
  exports('show', function (text, icon, key) {
    if (text !== cache.text || icon !== cache.icon || key !== cache.key) {
      SendNuiMessage(JSON.stringify({
        type: 'show',
        icon: icon,
        text: text,
        key: key
      }))
      cache.text = text
      cache.icon = icon
      cache.key = key
    }
  })

  exports('hide', function () {
    SendNuiMessage(JSON.stringify({
      type: 'hide',
    }))
  })
})