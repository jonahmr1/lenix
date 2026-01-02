import { lobbyCoords, openDelay } from "../../shared/constants"
import { doesUserAlreadyExist } from "../api/dashboard"
import { destroyCam } from "@trippler/tr_kit/client"
import { triggerNuiCallback } from '@trippler/tr_lib/client'
import { createCam } from '@trippler/tr_kit/client'

let lastPlayerCoords: number[] = []

const setCoords = (coords: number[]) => {
  SetEntityCoords(PlayerPedId(), coords[1], coords[2], coords[3], true, false, true, false)
  if (coords[4] != null) {
    SetEntityHeading(PlayerPedId(), coords[4])
  }
}

let lastCamHandle: number

const createCamera = (fadeIn: number, fadeOut: number, delay: number) => {
  const cam: [number, number, number, number] = [ 479.3787, -1316.2129, 29.2034, 62.6716 ]
  lastCamHandle = createCam({
    coords: cam,
    rotation: { vertical: 2.0, horizontal: 0.0 },
    details: {
      fov: 50.0,
      fadeIn: fadeIn ?? 200,
      fadeOut: fadeOut ?? 200,
      delay: delay ?? 2000,
    }
  })
}

const placePlayerInLobby = () => {
  createCamera(0, 0, 0)
  setTimeout(() => {
    const coords = GetEntityCoords(PlayerPedId(), true)
    lastPlayerCoords = [ ...coords ]
    setCoords(lobbyCoords)
    FreezeEntityPosition(PlayerPedId(), true)
  }, openDelay)
}

export const openGame = () => {
  placePlayerInLobby()
  setTimeout(async () => {
    const identity = await doesUserAlreadyExist()
    triggerNuiCallback('dashboard/open', identity)
  }, openDelay)
}

export const hideGame = () => {
  triggerNuiCallback('dashboard/hide')
}

export const showGame = () => {
  triggerNuiCallback('dashboard/show')
  createCamera(0, 0, 0)
}

export const closeGame = () => {
  triggerNuiCallback('dashboard/close')
  destroyCam({handle: lastCamHandle})
  Wait(200)
  setCoords(lastPlayerCoords)
  FreezeEntityPosition(PlayerPedId(), false)
  exports.tr_onboarding.logoutPlayer()
  return true
}