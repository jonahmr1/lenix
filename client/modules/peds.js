function createPeds() {
    for (const [key, value] of Object.entries(System)) {
    if (key === "_DEFAULT") continue
        const fallbackSettings = System._DEFAULT.PEDS
        value.PEDS.peds.forEach(async pedElement => {
            const settings = tableFiller(fallbackSettings, pedElement)
            const [handle, netId] = await exports.tr_kit.createSinglePed(settings)
            on('onResourceStop', (resourceName) => {
                resourceName == GetCurrentResourceName() && exports.tr_kit.clearCreatedPed(netId)
            })
        });
    }
}