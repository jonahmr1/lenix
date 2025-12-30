import refreshFriends from "../dom/dashboard"
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

onNuiCallback('dashboard/open', async (identity) => {
  if (typeof identity === 'number') {
    const response = await triggerNuiCallback<boolean>('dashboard/startCharacterProcess')
    if (!response) return
    openDashboard(identity)
    setDashboardState(true)
  } else {
    openDashboard(identity)
    setDashboardState(true)
  }
})

onNuiCallback('dashboard/close', () => {
  closeDashboard(true)
  setDashboardState(false)
})

onNuiCallback('dashboard/hide', () => {
  hideDashboard()
})

onNuiCallback('dashboard/show', () => {
  showDashboard()
})

export const getServerProfile = () => triggerNuiCallback<ServerProfile>('dashboard/getServerProfile')
export const createUser =  (name: string, avatar: string) => triggerNuiCallback<CreateUser>('dashboard/createUser', { name, avatar })
export const getUserProfile = (identity: number) => triggerNuiCallback<GetUserProfile>('dashboard/getUserProfile', { identity })

export const acceptFriendship = async (identity: number) => {
  const response = await triggerNuiCallback<AcceptFriendship>('dashboard/acceptFriendship', {identity})
  if (!response) return
  createFriendItem(identity)
  return true
}
export const getPlayerFriends = async () => {
  const friends = await triggerNuiCallback<GetPlayerFriends>('dashboard/getPlayerFriends')
  refreshFriends((friends as number[])?.length)
  return friends
}
export const getOutgoingFriends = () => triggerNuiCallback<GetOutgoingFriends>('dashboard/getOutgoingFriends')
export const getIncomingFriends = () => triggerNuiCallback<GetIncomingFriends>('dashboard/getIncomingFriends')
export const getFriendablePlayers = () => triggerNuiCallback<GetFriendablePlayers>('dashboard/getFriendablePlayers')
export const removeIncomingRequest = (identity: number) => triggerNuiCallback<RemoveIncomingRequest>('dashboard/removeIncomingRequest', { identity })
export const removePlayerFriendship = (identity: number) => triggerNuiCallback<RemovePlayerFriendship>('dashboard/removePlayerFriendship', { identity })
export const sendUserFriendInvitation = (identity: number) => triggerNuiCallback<SendUserFriendInvitation>('dashboard/sendUserFriendInvitation', { identity })
export const cancelOutgoingFriendship = (identity: number) => triggerNuiCallback<CancelOutgoingFriendship>('dashboard/cancelOutgoingFriendship', { identity })