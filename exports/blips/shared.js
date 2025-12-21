function createBlip(coords, icon) {
    const blipHandle = AddBlipForCoord(coords.x, coords.y, coords.z);
    SetBlipSprite(blipHandle, icon);
    on('onResourceStop', function(resourceName) {
        if (resourceName === GetCurrentResourceName()) {
            RemoveBlip(blipHandle)
        }
    })
    return blipHandle
}

exports('createBlip', createBlip)