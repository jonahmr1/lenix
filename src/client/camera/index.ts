import { CreateCamSettings, DestroyCamSettings } from '../../shared'

export const createCam = (settings: CreateCamSettings): number => {
  const coords = settings.coords
  const rotation = settings.rotation
  const details = {
    fov: settings?.details?.fov ?? 40.0,
    fadeOut: settings?.details?.fadeOut ?? 0,
    fadeIn: settings?.details?.fadeIn ?? 0,
    delay: settings?.details?.delay ?? 0,
    rotationOrder: settings?.details?.rotationOrder ?? 0
  }
  DoScreenFadeOut(details.fadeOut)
  const camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", coords[0], coords[1], coords[2], rotation.vertical, rotation.horizontal, coords[3], details.fov, false, details.rotationOrder)
  setTimeout(() => {
    SetCamActive(camHandle, true)
    RenderScriptCams(true, true, details.delay, true, true)
    DoScreenFadeIn(details.fadeIn)
  }, details.delay)
  return camHandle
}

export const destroyCam = (settings: DestroyCamSettings): void => {
  const handle = settings.handle
  const details = {
    fadeOut: settings?.details?.fadeOut ?? 0,
    fadeIn: settings?.details?.fadeIn ?? 0,
    delay: settings?.details?.delay ?? 0
  }
  DoScreenFadeOut(details.fadeOut)
  setTimeout(() => {
    RenderScriptCams(false, false, details.delay, true, true)
    SetCamActive(handle, false)
    DoScreenFadeIn(details.fadeIn)
  }, details.delay)
}