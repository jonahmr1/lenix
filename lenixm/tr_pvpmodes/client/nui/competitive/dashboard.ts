import { onNuiCallback } from '@trippler/tr_lib/client'
import {
  acceptFriendship,
  cancelOutgoingFriendship,
  getFriendablePlayers,
  getIncomingFriends,
  getOutgoingFriends,
  getPlayerFriends,
  removeIncomingRequest,
  removePlayerFriendship,
  sendUserFriendInvitation,
  createUser,
  getUserProfile
} from '../../api/competitive/dashboard'
import { closeGame, openGame } from '../../game/competitive/dashboard'
import { lobbyCoords, profile } from '../../../shared/constants/competitive'
import { startCharacterProcess } from '../../game/onboarding'

onNuiCallback<undefined>('competitive/dashboard/closeGame', (_data, callback) => {
  closeGame()
  callback(true)
})
onNuiCallback<undefined>('competitive/dashboard/startCharacterProcess', async (_data, callback) => callback(await startCharacterProcess(lobbyCoords, undefined, undefined, openGame)))
onNuiCallback<undefined>('competitive/dashboard/getServerProfile', async (_data, callback) => callback(profile))
onNuiCallback<{ name: string, avatar: string }>('competitive/dashboard/createUser', async (data, callback) => callback(await createUser(data.name, data.avatar)))
onNuiCallback<{ identity: number }>('competitive/dashboard/getUserProfile', async (data, callback) => callback(await getUserProfile(data.identity)))
onNuiCallback<{ identity: number }>('competitive/dashboard/acceptFriendship', async (data, callback) => callback(await acceptFriendship(data.identity)))
onNuiCallback<{ identity: number }>('competitive/dashboard/cancelOutgoingFriendship', async (data, callback) => callback(await cancelOutgoingFriendship(data.identity)))
onNuiCallback<{ identity: number }>('competitive/dashboard/removeIncomingRequest', async (data, callback) => callback(await removeIncomingRequest(data.identity)))
onNuiCallback<{ identity: number }>('competitive/dashboard/removePlayerFriendship', async (data, callback) => callback(await removePlayerFriendship(data.identity)))
onNuiCallback<{ identity: number }>('competitive/dashboard/sendUserFriendInvitation', async (data, callback) => callback(await sendUserFriendInvitation(data.identity)))
onNuiCallback<null>('competitive/dashboard/getPlayerFriends', async (_data, callback) => callback(await getPlayerFriends()))
onNuiCallback<null>('competitive/dashboard/getIncomingFriends', async (_data, callback) => callback(await getIncomingFriends()))
onNuiCallback<null>('competitive/dashboard/getOutgoingFriends', async (_data, callback) => callback(await getOutgoingFriends()))
onNuiCallback<null>('competitive/dashboard/getFriendablePlayers', async (_data, callback) => callback(await getFriendablePlayers()))
onNuiCallback<null>('competitive/dashboard/leaveGame', async (_data, callback) => {
  closeGame()
  callback(true)
})