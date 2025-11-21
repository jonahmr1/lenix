onNet('lenix_vehicles:proccess', async (systemKey, configIndex) => {
    const src = source
    const playerData = Bridge.getPlayerData(src)
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const isRegisterable = proccessedItems.registerable

    if (isRegisterable) {
        if (playerData.money.cash >= (proccessedItems.price)) {
            const netId = await spawnBoughtVehicle(src, true, systemKey, configIndex)
            if (netId) {
                Bridge.removeCash(proccessedItems.price)
                Bridge.notify(src, 'Vehicle Successfully Bought', 'success')
            } else {
                lib.console.trace('Failed to sell the car to the player with the id of: ' + src)
            }
        } else {
            Bridge.notify(src, 'You Don\'t Have Enough Money !', 'error')
        }
    } else {
        const netId = await spawnBoughtVehicle(src, false, systemKey, configIndex)
        if (netId) {
            Bridge.notify(src, 'Vehicle Successfully took out', 'success')
        } else {
            lib.console.trace('Failed to take the car out to the player with the id of: ' + src)
        }
    }
})

async function spawnBoughtVehicle(source, isRegisterable, systemKey, configIndex) {
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const [handle, netId] = await exports.tr_kit.createSingleVehicle(source, {
        hash: GetHashKey(Items[selectedConfig][configIndex].vehicle),
        coords: System[systemKey].VEHICLES.spawn,
        preCreate: true
    })
    if (netId && handle) {
        const plate = generatePlate(proccessedItems.plate)
        SetVehicleNumberPlateText(handle, plate)
        Bridge.giveKeys(plate)
        const [existingHandle, _] = await lib.awaitInstanceExisting(null, netId)
        proccessedItems.warp && TaskWarpPedIntoVehicle(GetPlayerPed(source), existingHandle, -1)

        const response = lib.callback.await('prepareVehicle', 250, source, netId, proccessedItems.style)
        if (!response) {
            lib.console.warn(`Failed to prepare the vehicle ${handle} in time for the player with id of ${source}`)
        }

        if (isRegisterable) {
            const response = await insertSQL(
                [],
                {
                    model: proccessedItems.vehicle,
                    hash: GetHashKey(proccessedItems.vehicle)
                },
                proccessedItems.plate[0],
                source
            )
            if (response) {
                return netId
            }
        } else {
            emitNet('lenix_vehicle:client:addReturnOption', source, netId, proccessedItems)
        }
        return netId
    } else {
        lib.console.trace('Vehicle net id could not be found')
    }
    return false
}