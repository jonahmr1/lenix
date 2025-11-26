const createCam = (settings) => {
  const coords = settings.coords
  const rotation = settings.rotation
  const more = {
    fov: settings?.more?.fov ?? 40.0,
  }
  DoScreenFadeOut(200)
  camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", coords[0], coords[1], coords[2], rotation.vertical, rotation.horizontal, coords[3], more.fov, false, 0)
  setTimeout(() => {
    SetCamActive(camHandle, true)
    RenderScriptCams(true, true, 0, true, true)
    DoScreenFadeIn(200)
  }, 2000)
  return camHandle
}

const destroyCam = (camHandle) => {
  DoScreenFadeOut(200)
  setTimeout(() => {
    RenderScriptCams(false, false, 2000, true, true)
    SetCamActive(camHandle, false)
    DoScreenFadeIn(200)
  }, 2000)
}

exports('createCam', createCam)
exports('destroyCam', destroyCam)