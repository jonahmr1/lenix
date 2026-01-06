export interface PlayerData {
  status: boolean
  ctitizenId: string
  name: string
  callsign: string
}

export interface DepartmentData {
  totalPlayers: number
  activePlayers: number
  budget: number
}

export interface ServerRanks {
  grade: number
  name: string
}

export interface ManageFundsObject {
  action: string
  amount: number
  reason: string
}

export interface TransferFundsObject {
  citizenid: string
  type: string
  amount: number
}

export interface UpdateReputationObject {
  citizenid: string
  action: string
  points: number
}

export interface FirePlayerObject {
  citizenid: string
  reason: string
}

export interface HirePlayerObject {
  citizenid: string
  rank: string
  callsign: number
}


import { ServicesTypes } from '../../server/services'

export interface UpdateDataCB {
  players: Awaited<ServicesTypes["JobPlayersData"]>
  ranks: Awaited<ServicesTypes["JobRanks"]>
  stats: {
    budget: Awaited<ServicesTypes["SocietyBudget"]>
    totalPlayers: Awaited<ServicesTypes["TotalPlayers"]>
    activePlayers: Awaited<ServicesTypes["JobOnlinePlayers"]>
  }
}

export type Types = ServicesTypes