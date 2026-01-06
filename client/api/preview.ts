import { triggerPromise } from "@trippler/tr_lib/client"
import { bridge } from "."
import { IsZoneFree } from ".."
import { settings, config } from "../../shared/constants"
import { trace } from "@trippler/tr_lib/shared"
import { createSingleVehicle, destroyCreatedVehicle } from "@trippler/tr_kit/client"

let isInPreview = false

const createPreviewCam = (key: unknown, netId: unknown) => {
  const vehicle = NetworkGetEntityFromNetworkId(netId)
  const cam = settings[key].VEHICLES.preview.cam
  bridge.drawText.show()
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

const clearPreviewCam = async (netId: unknown) => {
  bridge.drawText.hide()

  FreezeEntityPosition(PlayerPedId(), false)
  const success = await destroyCreatedVehicle(netId)
  if (!success) trace('failed to create the preview vehicle, reponse was: ' + success)

  DoScreenFadeOut(200)
  setTimeout(() => {
    DoScreenFadeIn(200)
  }, 500)
  RenderScriptCams(false, false, 2000, true, true)
  isInPreview = false
}

export const previewVehicle = async (key: unknown, index: unknown) => {
  const selectedConfig = settings[key].ITEM
  const configItems = config[selectedConfig]
  if (!isInPreview) {
    const isPreviewSessionBusy = await triggerPromise('sessionStatus')
    if (isPreviewSessionBusy) {
      bridge.notify('Preview service is currently busy, try again later', 'error')
      return
    }
    const isThePlaceClear = await IsZoneFree(settings[key].VEHICLES.preview.coords)
    if (!isThePlaceClear) {
      bridge.notify('Preview point is currently busy!', 'error')
      return
    }
    emitNet('lenix_vehicles:server:setPreviewSessionBusy', true)
    const [handle, netId] = await createSingleVehicle({
      hash: GetHashKey(configItems[index].vehicle),
      coords: settings[key].VEHICLES.preview.coords,
    })
    if (handle && netId) {
      createPreviewCam(key, netId)
      const tick = setTick(() => {
        if (IsControlJustReleased(0, 177)) {
          emitNet('lenix_vehicles:server:setPreviewSessionBusy', false)
          clearPreviewCam(netId);
          clearTick(tick);
        }
      });
    }
  }
}