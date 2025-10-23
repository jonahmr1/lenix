RegisterNuiCallback('nuiReady', function(data, cb) {
    cb(true)
    exports('show', function(text, icon, key) {
        SendNuiMessage(JSON.stringify({
            type: 'show',
            icon: icon,
            text: text,
            key: key
        }))
    })

    exports('hide', function() {
        SendNuiMessage(JSON.stringify({
            type: 'hide',
        }))
    })
})