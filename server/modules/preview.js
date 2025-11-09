lib.callback.register('lenix_patrolvehicles:CheckIfActive', function(source) {
    let src = source

    if (!isActive) {
        emit("lenix_patrolvehicles:server:SetActive", true)
        return true
    } else {
        emitNet("QBCore:Notify", src, "We are already in busy with someone else", "error")
        return false
    }
})

onNet('lenix_patrolvehicles:server:SetActive', function(status) {
    if (status) {
        isActive = status
        TriggerClientEvent('lenix_patrolvehicles:client:SetActive', -1, isActive)
    } else {
        TriggerClientEvent('lenix_patrolvehicles:client:SetActive', -1, isActive)
    }
})