import './chat'
import createCam, { lastCamHandle } from './camera'
import { lobbyCoords, openDelay } from "../../shared/constants"
import { doesUserAlreadyExist } from "../api/dashboard"
import { destroyCam } from "@trippler/tr_kit/client"
import { triggerNuiCallback } from '@trippler/tr_lib/client'

let lastPlayerCoords: number[] = []

const setCoords = (coords: number[]) => {
  SetEntityCoords(PlayerPedId(), coords[1], coords[2], coords[3], true, false, true, false)
  if (coords[4] != null) {
    SetEntityHeading(PlayerPedId(), coords[4])
  }
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
  createCam(0, 0, 0)
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