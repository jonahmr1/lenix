const createCam = (settings) => {
  const coords = settings.coords
  const rotation = settings.rotation
  const more = {
    fov: settings?.more?.fov ?? 40.0,
    fadeOut: settings?.more?.fadeOut ?? 0,
    fadeIn: settings?.more?.fadeIn ?? 0,
    delay: settings?.more?.delay ?? 0,
  }
  DoScreenFadeOut(more.fadeOut)
  camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", coords[0], coords[1], coords[2], rotation.vertical, rotation.horizontal, coords[3], more.fov, false, 0)
  setTimeout(() => {
    SetCamActive(camHandle, true)
    RenderScriptCams(true, true, 0, true, true)
    DoScreenFadeIn(more.fadeIn)
  }, more.delay)
  return camHandle
}

const destroyCam = (settings) => {
  const camHandle = settings.camHandle
  const fadeOut = settings?.more?.fadeOut ?? 0
  const fadeIn = settings?.more?.fadeIn ?? 0
  const delay = settings?.more?.delay ?? 0
  DoScreenFadeOut(fadeOut)
  setTimeout(() => {
    RenderScriptCams(false, false, delay, true, true)
    SetCamActive(camHandle, false)
    DoScreenFadeIn(fadeIn)
  }, delay)
}

exports('createCam', createCam)
exports('destroyCam', destroyCam)