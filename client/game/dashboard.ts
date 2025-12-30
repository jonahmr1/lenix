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

export let lastCamHandle: number

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

export const openGame = () => {
  placePlayerInLobby()
  setTimeout(async () => {
    const identity = await doesUserAlreadyExist()
    triggerNuiCallback('open', identity)
    SetNuiFocus(true, true)
  }, openDelay)
}

export const hideGame = () => {
  triggerNuiCallback('hide')
  SetNuiFocus(false, false)
}

export const showGame = () => {
  triggerNuiCallback('show')
  SetNuiFocus(true, true)
  createCamera(0, 0, 0)
}

export const placePlayerInLobby = () => {
  createCam
  setTimeout(() => {
    const coords = GetEntityCoords(PlayerPedId(), true)
    lastPlayerCoords = [ ...coords ]
    setCoords(lobbyCoords)
    FreezeEntityPosition(PlayerPedId(), true)
  }, openDelay)
}

export const closeGame = () => {
  triggerNuiCallback('close')
  SetNuiFocus(false, false)
  destroyCam({handle: lastCamHandle})
  Wait(200)
  setCoords(lastPlayerCoords)
  FreezeEntityPosition(PlayerPedId(), false)
  emitNet('tr_spawn/server/logout')
  return true
}