onNet('lenix_vehicles:proccess', async (systemKey, configIndex) => {
    const src = source
    const getPlayerMoney = Bridge.getPlayerMoney(src)
    const selectedConfig = System[systemKey].ITEM
    const proccessedItems = tableFiller(Items._DEFAULT, Items[selectedConfig][configIndex])
    const isRegisterable = proccessedItems.registerable

    if (isRegisterable) {
        if (getPlayerMoney.money.cash >= (proccessedItems.price)) {
            const netId = await spawnBoughtVehicle(src, true, systemKey, configIndex)
            if (netId) {
                Bridge.removeCash(src, proccessedItems.price)
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
        preCreate: true,
        plate: generatePlate(proccessedItems.plate),
        warp: {
            entityNetId: await lib.awaitInstanceExisting(GetPlayerPed(source))[1],
            seat: -1
        },
        giveKey: true,
        setFuelAmount: 100,
        engine: {
            instantly: true,
            disableAutoStart: true
        },
        customize: {
            style: [proccessedItems.style[0], proccessedItems.style[1], proccessedItems.style[2]],
            livery: proccessedItems.style.livery
        },
        register: isRegisterable
    })
    if (netId && handle) {
        if (isRegisterable) {
            return netId
        } else {
            emitNet('lenix_vehicle:client:addReturnOption', source, netId, proccessedItems)
        }
        return netId
    } else {
        lib.console.trace('Vehicle net id could not be found')
    }
    return false
}