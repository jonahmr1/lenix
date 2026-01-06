import { onNuiCallback } from "@trippler/tr_lib/client"
import { firePlayer, manageFunds, transferFunds, updateReputation, openStash, hirePlayer } from "../modules"
import { FirePlayerObject, HirePlayerObject, ManageFundsObject, TransferFundsObject, UpdateReputationObject } from "../../shared/types"

onNuiCallback<HirePlayerObject>('hirePlayer', (data, cb) => {
  hirePlayer(data.citizenid, data.rank, data.callsign)
  cb(true)
})

onNuiCallback<FirePlayerObject>('firePlayer', (data, cb) => {
  firePlayer(data.citizenid, data.reason)
  cb(true)
})

onNuiCallback<UpdateReputationObject>('updateReputation', (data, cb) => {
  updateReputation(data.citizenid, data.action, data.points)
  cb(true)
})

onNuiCallback<TransferFundsObject>('transferFunds', (data, cb) => {
  transferFunds(data.citizenid, data.type, data.amount)
  cb(true)
})

onNuiCallback<ManageFundsObject>('manageFunds', (data, cb) => {
  manageFunds(data.action, data.amount, data.reason)
  cb(true)
})

onNuiCallback('openStash', (_data, cb) => {
  openStash()
  cb(true)
})