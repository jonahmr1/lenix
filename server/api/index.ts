import { isPreviewSessionBusy, proccessVehicleRegisteration, setPreviewSessionBusy } from "../services"
import { onPromise } from '@trippler/tr_lib/server'

const qb = exports['qb-core'].GetCoreObject()

export const bridge = {
  getPlayerMoney: (source: unknown) => {
    const playerData = exports.qbx_core.GetPlayer(source).PlayerData
    return { money: playerData.money }
  },
  removeCash: (source: unknown, amount: unknown) => {
    qb.Functions.GetPlayer(source).Functions.RemoveMoney('cash', amount)
  },
  notify: (source: unknown, message: unknown, type: unknown) => {
    emitNet('qb:Notify', source, message, type)
  },
  getPlayerJob: (source: unknown) => {
    const job = qb.Functions.GetPlayer(source).PlayerData.job
    const gradeLevel = qb.Functions.GetPlayer(source).PlayerData.job.grade.level
    return { name: job, grade: gradeLevel}
  },
  getPlayerGang: (source: unknown) => {
    const gang = qb.Functions.GetPlayer(source).PlayerData.gang
    const gradeLevel = qb.Functions.GetPlayer(source).PlayerData.gang.grade.level
    return { name: gang, grade: gradeLevel}
  }
}

onPromise('sessionStatus', () => isPreviewSessionBusy)

onNet('lenix_vehicles:server:setPreviewSessionBusy', setPreviewSessionBusy)
onNet('lenix_vehicles:proccess', proccessVehicleRegisteration)