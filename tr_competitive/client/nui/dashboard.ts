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
} from '../api/dashboard'
import { closeGame } from '../game/dashboard'
import { profile } from '../../shared/constants'
import { startCharacterProcess } from '../api/dashboard'

onNuiCallback<undefined>('dashboard/closeGame', (_data, callback) => {
  closeGame()
  callback(true)
})
onNuiCallback<undefined>('dashboard/startCharacterProcess', async (_data, callback) => callback(await startCharacterProcess()))
onNuiCallback<undefined>('dashboard/getServerProfile', async (_data, callback) => callback(profile))
onNuiCallback<{ name: string, avatar: string }>('dashboard/createUser', async (data, callback) => callback(await createUser(data.name, data.avatar)))
onNuiCallback<{ identity: number }>('dashboard/getUserProfile', async (data, callback) => callback(await getUserProfile(data.identity)))
onNuiCallback<{ identity: number }>('dashboard/acceptFriendship', async (data, callback) => callback(await acceptFriendship(data.identity)))
onNuiCallback<{ identity: number }>('dashboard/cancelOutgoingFriendship', async (data, callback) => callback(await cancelOutgoingFriendship(data.identity)))
onNuiCallback<{ identity: number }>('dashboard/removeIncomingRequest', async (data, callback) => callback(await removeIncomingRequest(data.identity)))
onNuiCallback<{ identity: number }>('dashboard/removePlayerFriendship', async (data, callback) => callback(await removePlayerFriendship(data.identity)))
onNuiCallback<{ identity: number }>('dashboard/sendUserFriendInvitation', async (data, callback) => callback(await sendUserFriendInvitation(data.identity)))
onNuiCallback<null>('dashboard/getPlayerFriends', async (_data, callback) => callback(await getPlayerFriends()))
onNuiCallback<null>('dashboard/getIncomingFriends', async (_data, callback) => callback(await getIncomingFriends()))
onNuiCallback<null>('dashboard/getOutgoingFriends', async (_data, callback) => callback(await getOutgoingFriends()))
onNuiCallback<null>('dashboard/getFriendablePlayers', async (_data, callback) => callback(await getFriendablePlayers()))
onNuiCallback<null>('dashboard/leaveGame', async (_data, callback) => {
  closeGame()
  callback(true)
})