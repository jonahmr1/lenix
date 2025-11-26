const createCam = (settings) => {
  const coords = settings.coords
  const rotation = settings.rotation
  const more = {
    fov: settings?.more?.fov ?? 40.0,
  }
  DoScreenFadeOut(200)
  setTimeout(() => {
    DoScreenFadeIn(200)
  }, 500)
  camHandle = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", coords[0], coords[1], coords[2], rotation.vertical, rotation.horizontal, coords[3], more.fov, false, 0)
  SetCamActive(camHandle, true)
  RenderScriptCams(true, true, 2000, true, true)
}

const destroyCam = () => {
  DoScreenFadeOut(200)
  setTimeout(() => {
    DoScreenFadeIn(200)
  }, 500)
  RenderScriptCams(false, false, 2000, true, true)
}

exports('createCam', createCam)
exports('destroyCam', destroyCam)