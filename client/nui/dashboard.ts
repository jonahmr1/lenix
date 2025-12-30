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

onNuiCallback<{ name: string, avatar: string }>('createUser', async (data, callback) => callback(await createUser(data.name, data.avatar)))
onNuiCallback<{ identity: number }>('getUserProfile', async (data, callback) => callback(await getUserProfile(data.identity)))
onNuiCallback<{ identity: number }>('acceptFriendship', async (data, callback) => callback(await acceptFriendship(data.identity)))
onNuiCallback<{ identity: number }>('cancelOutgoingFriendship', async (data, callback) => callback(await cancelOutgoingFriendship(data.identity)))
onNuiCallback<{ identity: number }>('removeIncomingRequest', async (data, callback) => callback(await removeIncomingRequest(data.identity)))
onNuiCallback<{ identity: number }>('removePlayerFriendship', async (data, callback) => callback(await removePlayerFriendship(data.identity)))
onNuiCallback<{ identity: number }>('sendUserFriendInvitation', async (data, callback) => callback(await sendUserFriendInvitation(data.identity)))
onNuiCallback<null>('getPlayerFriends', async (_data, callback) => callback(await getPlayerFriends()))
onNuiCallback<null>('getIncomingFriends', async (_data, callback) => callback(await getIncomingFriends()))
onNuiCallback<null>('getOutgoingFriends', async (_data, callback) => callback(await getOutgoingFriends()))
onNuiCallback<null>('getFriendablePlayers', async (_data, callback) => callback(await getFriendablePlayers()))