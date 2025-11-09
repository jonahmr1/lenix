onNet('lenix_vehicles:proccess', async (systemKey, configIndex) => {
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    const isRegisterable = typeof Items[systemKey][configIndex].registerable == 'boolean' ? Items[systemKey][configIndex].registerable : Items['_DEFAULT'].registerable
    if (isRegisterable) {
        if (Player.PlayerData.money.cash >= (Items[systemKey][configIndex].price || Items['_DEFAULT'].price)) {
            const handle = await spawnBoughtVehicle(true, systemKey, configIndex)
            if (handle) {
                Player.Functions.RemoveMoney("cash", Items[systemKey][configIndex].price || Items['_DEFAULT'].price)
                emitNet('QBCore:Notify', src, 'Vehicle Successfully Bought', "success")
            } else {
                emitNet('QBCore:Notify', src, 'Vehicle Failed To Spawn !', "error")
            }
        } else {
            emitNet('QBCore:Notify', src, 'You Don\'t Have Enough Money !', "error")
        }
    } else {
        const handle = await spawnBoughtVehicle(false, systemKey, configIndex)
        if (handle) {
            emitNet('QBCore:Notify', src, 'Vehicle Successfully took out', "success")
        } else {
            emitNet('QBCore:Notify', src, 'Vehicle Failed To Spawn !', "error")
        }
    }
})

async function spawnBoughtVehicle(isRegisterable, systemKey, configIndex) {
    const handle = await exports.tr_kit.createSingleVehicle({
        hash: Items[systemKey][configIndex].model,
        coords: systemKey.VEHICLES.spawn,
    })
    if (isRegisterable) {
        emit('lenix_patrolvehicles:insert', [], Items[systemKey][configIndex].model, GetHashKey(Items[systemKey][configIndex].model), Items[systemKey][configIndex].plate)
    }
    return handle
}