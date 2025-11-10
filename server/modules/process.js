onNet('lenix_vehicles:proccess', async (systemKey, configIndex) => {
    const src = source
    const Player = QBCore.Functions.GetPlayer(src)
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const isRegisterable = proccessedItems.registerable
    
    if (isRegisterable) {
        if (Player.PlayerData.money.cash >= (proccessedItems.price)) {
            const netId = await spawnBoughtVehicle(true, systemKey, configIndex, src)
            if (netId) {
                Player.Functions.RemoveMoney("cash", proccessedItems.price)
                emitNet('QBCore:Notify', src, 'Vehicle Successfully Bought', "success")
            } else {
                lib.print.err('failed to sell the car to the player with the id of: ' + src)
            }
        } else {
            emitNet('QBCore:Notify', src, 'You Don\'t Have Enough Money !', "error")
        }
    } else {
        const netId = await spawnBoughtVehicle(false, systemKey, configIndex, src)
        if (netId) {
            emitNet('QBCore:Notify', src, 'Vehicle Successfully took out', "success")
        } else {
            lib.print.err('failed to sell the car to the player with the id of: ' + src)
        }
    }
})

async function spawnBoughtVehicle(isRegisterable, systemKey, configIndex, src) {
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const netId = await exports.tr_kit.createSingleVehicle({
        hash: GetHashKey(Items[selectedConfig][configIndex].vehicle),
        coords: System[systemKey].VEHICLES.spawn,
    })
    const handle = NetworkGetEntityFromNetworkId(netId)
    if (netId && handle) {
        const plate = generatePlate(proccessedItems.plate)
        SetVehicleNumberPlateText(handle, plate)
        emitNet("qb-vehiclekeys:server:AcquireVehicleKeys", plate)
        const response = lib.callback.await('prepareVehicle', src, 250, handle, proccessedItems.style)
        if (!response) {
            lib.print.warn(`Failed to prepare the vehicle ${handle} in time for the player with id of ${src}`)
        }

        if (isRegisterable) {
            const response = await insertSQL(
                [],
                {
                    model: proccessedItems.vehicle,
                    hash: GetHashKey(proccessedItems.vehicle)
                },
                proccessedItems.plate[0],
                src
            )
            if (response) {
                return netId
            }
        }
        return netId
    }
    return false
}