let isInPreview = false

function createPreviewCam(key, netId) {
    const vehicle = NetworkGetEntityFromNetworkId(netId)
    const cam = System[key].VEHICLES.preview.cam
    isInPreview = true
    FreezeEntityPosition(PlayerPedId(), true)
    DoScreenFadeOut(200)
    setTimeout(() => {
        DoScreenFadeIn(200)
    }, 500)
    SetVehicleUndriveable(vehicle, true)
    camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cam.coords[0], cam.coords[1], cam.coords[2], cam.rotation.verticalrotate, cam.rotation.horizontalrotate, cam.rotation.left_n_right, cam.fov, false, 0)
    SetCamActive(camHandle, true)
    RenderScriptCams(true, true, 500, true, true)
    exports['qb-core'].DrawText('⇽', 'bottom')
}

async function clearPreviewCam(netId) {
    exports['qb-core'].HideText()
    FreezeEntityPosition(PlayerPedId(), false)
    const success = await exports.tr_kit.clearCreatedVehicle(netId)
    if (!success) lib.print.err('failed to create the preview vehicle, reponse was ' + success)
    DoScreenFadeOut(200)
    setTimeout(() => {
        DoScreenFadeIn(200)
    }, 500)
    RenderScriptCams(false, false, 1, true, true)
    isInPreview = false
}

async function PreviewVehicle(key, index) {
    const selectedConfig = System[key].ITEM
    const configItems = Items[selectedConfig]
    if (!isInPreview) {
        const netId = await exports.tr_kit.createSingleVehicle({
            hash: GetHashKey(configItems[index].vehicle),
            coords: System[key].VEHICLES.preview.coords,
        })
        if (netId) {
            createPreviewCam(key, netId)
            const tick = setTick(() => {
                if (IsControlJustReleased(0, 177)) {
                    clearPreviewCam(netId);
                    clearTick(tick);
                }
            });
        }
    }
}