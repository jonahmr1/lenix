let InPreview = false

onNet('lenix_patrolvehicles:client:SetActive', function(status) {
    isActive = status
})

onNet('lenix_vehicles:preview', async (index) => {
    const status = lib.callback.await('lenix_patrolvehicles:CheckIfActive')
    if (status) {
        const data = await QBCore.Functions.GetVehicleData(index)
        const preview = data.preview
        const cam = data.preview.cam
        const coords = preview.coords
        InPreview = true
        const handle = await exports.tr_kit.createSingleVehicle({
            model: data.vehicle,
            coords: coords,
        })
        if (handle) {
            const veh = handle.vehicle
            FreezeEntityPosition(PlayerPedId(), true)
            SetVehicleNumberPlateText(veh, "PREVIEW")
            exports['qb-fuel'].SetFuel(veh, 0.0)
            FreezeEntityPosition(veh, true)
            SetVehicleEngineOn(veh, false, false, true)
            DoScreenFadeOut(200)
            setTimeout(() => {
                DoScreenFadeIn(200)
            }, 500)
            SetVehicleUndriveable(veh, true)

            VehicleCam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cam.coords.x, cam.coords.y, cam.coords.z, cam.rotation.verticalrotate, cam.rotation.horizontalrotate, cam.rotation.left_n_right, cam.fov, false, 0)   
            SetCamActive(VehicleCam, true)
            RenderScriptCams(true, true, 2000, true, true)

            while (true) {
                if (InPreview) {
                    exports['qb-core'].DrawText('⇽', 'bottom')
                } else if (!InPreview) {
                    exports['qb-core'].HideText()
                    break
                }
                setTimeout(() => {}, 1)
            }

            while (true) {
                if (IsControlJustReleased(0, 177)) {
                    FreezeEntityPosition(PlayerPedId(), false)
                    const cleared = await exports.tr_kit.clearCreatedVehicle(veh)
                    if (cleared) {
                        DoScreenFadeOut(200)
                        setTimeout(() => {
                            DoScreenFadeIn(200)
                        }, 500)
                        RenderScriptCams(false, false, 1, true, true)
                        InPreview = false
                        TriggerServerEvent("lenix_patrolvehicles:server:SetActive", false)
                        break
                    } else {
                        exports['qb-core'].Notify('error', 'Something went wrong')
                        break
                    }
                }
                setTimeout(() => {}, 1)
            }
        }
    }
})