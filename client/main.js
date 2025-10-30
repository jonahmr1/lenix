const config = exports.tr_lib.load('config')

SendNuiMessage(JSON.stringify({
    type: 'init',
    color: config.primary
}))

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