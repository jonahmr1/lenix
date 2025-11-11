onNet('lenix_vehicles:proccess', async (systemKey, configIndex) => {
    const src = source
    const playerData = Bridge.getPlayerData(src)
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const isRegisterable = proccessedItems.registerable

    if (isRegisterable) {
        if (playerData.money.cash >= (proccessedItems.price)) {
            const netId = await spawnBoughtVehicle(true, systemKey, configIndex, src)
            if (netId) {
                Bridge.removeMoney('cash', proccessedItems.price)
                Bridge.notify(src, 'Vehicle Successfully Bought', 'success')
            } else {
                lib.print.err('Failed to sell the car to the player with the id of: ' + src)
            }
        } else {
            Bridge.notify(src, 'You Don\'t Have Enough Money !', 'error')
        }
    } else {
        const netId = await spawnBoughtVehicle(false, systemKey, configIndex, src)
        if (netId) {
            Bridge.notify(src, 'Vehicle Successfully took out', 'success')
        } else {
            lib.print.err('Failed to take the car out to the player with the id of: ' + src)
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
        Bridge.giveKeys(plate)
        proccessedItems.warp && TaskWarpPedIntoVehicle(GetPlayerPed(src), handle, -1)

        const response = lib.callback.await('prepareVehicle', 250, src, handle, proccessedItems.style)
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
        } else {
            emitNet('lenix_vehicle:client:addReturnOption', src, netId, proccessedItems)
        }
        return netId
    } else {
        lib.print.err('Vehicle net id could not be found')
    }
    return false
}