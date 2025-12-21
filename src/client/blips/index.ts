export default (coords: [number, number, number], icon: number): number => {
    const blipHandle = AddBlipForCoord(coords[0], coords[1], coords[2])
    SetBlipSprite(blipHandle, icon)
    on('onResourceStop', function(resourceName: string) {
        if (resourceName === GetCurrentResourceName()) {
            RemoveBlip(blipHandle)
        }
    })
    return blipHandle
}