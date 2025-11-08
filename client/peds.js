for (const [key, value] of Object.entries(System)) {
    if (key === "_DEFAULT") continue
    const fallbackSettings = System._DEFAULT.PEDS
    value.PEDS.peds.forEach(async pedElement => {
        const settings = {
            ...fallbackSettings,
            ...pedElement,
            scenario: {
                ...fallbackSettings.scenario,
                ...pedElement.scenario
            }
        }
        const handle = await exports.tr_kit.createSinglePed(settings)
        on('onResourceStop', (resourceName) => {
            resourceName == GetCurrentResourceName() && exports.tr_kit.clearCreatedPed(handle)
        })
    });
}