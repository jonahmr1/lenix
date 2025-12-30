import refreshFriends from "../utils/dashboard/dom"
import createFriendItem from "../modules/dashboard/createFriendItem"
import {
  CancelOutgoingFriendship,
  AcceptFriendship,
  GetFriendablePlayers,
  GetIncomingFriends,
  GetOutgoingFriends,
  GetPlayerFriends,
  RemoveIncomingRequest,
  RemovePlayerFriendship,
  SendUserFriendInvitation,
  CreateUser,
  GetUserProfile,
  ServerProfile
} from "../../../shared/types"
import openDashboard from '../modules/dashboard/states/openDashboard'
import closeDashboard from '../modules/dashboard/states/closeDashboard'
import hideDashboard from '../modules/dashboard/states/hideDashboard'
import showDashboard from '../modules/dashboard/states/showDashboard'
import { onNuiCallback, triggerNuiCallback } from '@trippler/tr_lib/web'
import { setDashboardState } from "../hooks/dashboard"

onNuiCallback('open', async (identity) => {
  if (typeof identity === 'number') {
    const response = await triggerNuiCallback<boolean>('startCharacterProcess')
    if (!response) return
    openDashboard(identity)
    setDashboardState(true)
  } else {
    openDashboard(identity)
    setDashboardState(true)
  }
})

onNuiCallback('close', () => {
  closeDashboard(true)
  setDashboardState(false)
})

onNuiCallback('hide', () => {
  hideDashboard()
})

onNuiCallback('show', () => {
  showDashboard()
})

export const getServerProfile = () => triggerNuiCallback<ServerProfile>('getServerProfile')
export const createUser =  (name: string, avatar: string) => triggerNuiCallback<Awaited<CreateUser>>('createUser', { name, avatar })
export const getUserProfile = (identity: number) => triggerNuiCallback<GetUserProfile>('getUserProfile', { identity })

export const acceptFriendship = async (identity: number) => {
  const response = await triggerNuiCallback<AcceptFriendship>('acceptFriendship', {identity})
  if (!response) return
  createFriendItem(identity)
  return true
}
export const getPlayerFriends = async () => {
  const friends = await triggerNuiCallback<GetPlayerFriends>('getPlayerFriends')
  refreshFriends((friends as number[])?.length)
  return friends
}
export const getOutgoingFriends = () => triggerNuiCallback<GetOutgoingFriends>('getOutgoingFriends')
export const getIncomingFriends = () => triggerNuiCallback<GetIncomingFriends>('getIncomingFriends')
export const getFriendablePlayers = () => triggerNuiCallback<GetFriendablePlayers>('getFriendablePlayers')
export const removeIncomingRequest = (identity: number) => triggerNuiCallback<RemoveIncomingRequest>('removeIncomingRequest', { identity })
export const removePlayerFriendship = (identity: number) => triggerNuiCallback<RemovePlayerFriendship>('removePlayerFriendship', { identity })
export const sendUserFriendInvitation = (identity: number) => triggerNuiCallback<SendUserFriendInvitation>('sendUserFriendInvitation', { identity })
export const cancelOutgoingFriendship = (identity: number) => triggerNuiCallback<CancelOutgoingFriendship>('cancelOutgoingFriendship', { identity })