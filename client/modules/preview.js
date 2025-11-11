let isInPreview = false
function IsZoneFree(zone) {
  const response = lib.isZoneClear({ coords: zone, radius: 3.5 })
  return response
}

function createPreviewCam(key, netId) {
    const vehicle = NetworkGetEntityFromNetworkId(netId)
    const cam = System[key].VEHICLES.preview.cam
    Bridge.drawText.show()
    isInPreview = true

    FreezeEntityPosition(PlayerPedId(), true)
    SetVehicleUndriveable(vehicle, true)

    DoScreenFadeOut(200)
    setTimeout(() => {
        DoScreenFadeIn(200)
    }, 500)
    camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cam.coords[0], cam.coords[1], cam.coords[2], cam.rotation.verticalrotate, cam.rotation.horizontalrotate, cam.rotation.left_n_right, cam.fov, false, 0)
    SetCamActive(camHandle, true)
    RenderScriptCams(true, true, 2000, true, true)
}

async function clearPreviewCam(netId) {
    Bridge.drawText.hide()

    FreezeEntityPosition(PlayerPedId(), false)
    const success = await exports.tr_kit.clearCreatedVehicle(netId)
    if (!success) lib.console.err('failed to create the preview vehicle, reponse was: ' + success)

    DoScreenFadeOut(200)
    setTimeout(() => {
        DoScreenFadeIn(200)
    }, 500)
    RenderScriptCams(false, false, 2000, true, true)
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