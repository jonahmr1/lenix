import { onPromise } from '@trippler/tr_lib/server'
import { getSingleRow, updateRow, getSingleColumn } from '../../database/competitive/queries'
import getPlayerLicense from '../../utils/competitive/getPlayerLicense'
import { createUserIntoTheDatabase, doesUserAlreadyExist } from '../../services/competitive/dashboard'

export const getUserProfileCB = async (identity: number) => {
  const response = await getSingleRow<{ name: string, avatar: string }>('name, avatar', 'tr_pvpmodes_users', 'identity = ?', identity)
  return response && { ...response }
}

onPromise('tr_pvpmodes/server/competitive/createUser', (source, name: string, avatar: string) => createUserIntoTheDatabase(getPlayerLicense(source), name, avatar))
onPromise('tr_pvpmodes/server/competitive/doesUserAlreadyExist', (source) => doesUserAlreadyExist(source))
onPromise('tr_pvpmodes/server/competitive/getUserProfile', async (_source, identity: number) => getUserProfileCB(identity))

export const acceptFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number, friends: number[] }>('identity, friends', 'tr_pvpmodes_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ friends: number[] }>('friends', 'tr_pvpmodes_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.friends
  const receiverRequests = receiverResponse.friends
  senderRequests.push(identity)
  receiverRequests.push(senderId)

  const senderAffectedColumn = await updateRow('tr_pvpmodes_users', 'friends', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_pvpmodes_users', 'friends', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('tr_pvpmodes/server/competitive/acceptFriendship', async (source, identity: number) => acceptFriendshipCB(source, identity))

export const cancelOutgoingFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number, outgoingInvitations: number[] }>('identity, outgoingInvitations', 'tr_pvpmodes_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ incomingInvitations: number[] }>('incomingInvitations', 'tr_pvpmodes_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.outgoingInvitations
  const receiverRequests = receiverResponse.incomingInvitations
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)
  
  const senderAffectedColumn = await updateRow('tr_pvpmodes_users', 'outgoingInvitations', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_pvpmodes_users', 'incomingInvitations', 'identity = ?', JSON.stringify(receiverRequests), identity) 
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('tr_pvpmodes/server/competitive/cancelOutgoingFriendship', (source, identity: number) => cancelOutgoingFriendshipCB(source, identity))

export const getFriendablePlayersCB = async (source: number) => {
  const license = getPlayerLicense(source)
  const senderRow = await getSingleRow<{ identity: number, friends: number[], incomingInvitations: number[], outgoingInvitations: number[] }>('identity, friends, outgoingInvitations, incomingInvitations', 'tr_pvpmodes_users', 'license = ?', license)
  if (!senderRow) return
  const senderidentity = senderRow.identity
  const senderFriends = senderRow.friends
  const senderIncomingRequests = senderRow.incomingInvitations
  const senderOutgoingRequests = senderRow.outgoingInvitations

  const serverUsers = await getSingleColumn<{ identity: number }>('identity', 'tr_pvpmodes_users')
  if (!serverUsers) return

  let filteredPlayers: number[] = []
  serverUsers.forEach(user => {
    const notSelf = user.identity !== senderidentity
    const notFriend = !senderFriends.includes(user.identity)
    const notInIncoming = !senderIncomingRequests.includes(user.identity)
    const notInOutgoing = !senderOutgoingRequests.includes(user.identity)
    if (notSelf && notFriend && notInIncoming && notInOutgoing) filteredPlayers.push(user.identity)
    })
  return filteredPlayers
}

onPromise('tr_pvpmodes/server/competitive/getFriendablePlayers', async (source) => getFriendablePlayersCB(source))

export const getOutgoingFriendsCB = async (source: number): Promise<Array<number> | []> => {
  const response = await getSingleRow<{ outgoingInvitations: string }>('outgoingInvitations', 'tr_pvpmodes_users', 'license = ?', getPlayerLicense(source))
  return response ? JSON.parse(response.outgoingInvitations) : []
}

onPromise('tr_pvpmodes/server/competitive/getOutgoingFriends', async (source) => getOutgoingFriendsCB(source))

export const getPlayerFriendsCB = async (source: number): Promise<Array<number> | []> => {
  const response = await getSingleRow<{ friends: string }>('friends', 'tr_pvpmodes_users', 'license = ?', source)
  return response ? JSON.parse(response.friends) : []
}

onPromise('tr_pvpmodes/server/competitive/getPlayerFriends', async (source) => getPlayerFriendsCB(source))

export const getIncomingFriendsCB = async (): Promise<Array<number> | []> => {
  const response = await getSingleRow<{ incomingInvitations: string }>('incomingInvitations', 'tr_pvpmodes_users', 'license = ?', getPlayerLicense(source))
  return response ? JSON.parse(response.incomingInvitations) : []
}

onPromise('tr_pvpmodes/server/competitive/getIncomingFriends', getIncomingFriendsCB)

export const removeIncomingRequestCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number, incomingInvitations: number[] }>('identity, incomingInvitations', 'tr_pvpmodes_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ outgoingInvitations: number[] }>('outgoingInvitations', 'tr_pvpmodes_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.incomingInvitations
  const receiverRequests = receiverResponse.outgoingInvitations
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)

  const senderAffectedColumn = await updateRow('tr_pvpmodes_users', 'incomingInvitations', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_pvpmodes_users', 'outgoingInvitations', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('tr_pvpmodes/server/competitive/removeIncomingRequest', async (source, identity: number) => removeIncomingRequestCB(source, identity))

export const removePlayerFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number, friends: number[] }>('identity, friends', 'tr_pvpmodes_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ friends: number[] }>('friends', 'tr_pvpmodes_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.friends
  const receiverRequests = receiverResponse.friends
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)

  const senderAffectedColumn = await updateRow('tr_pvpmodes_users', 'friends', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_pvpmodes_users', 'friends', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('tr_pvpmodes/server/competitive/removePlayerFriendship', async (source, identity: number) => removePlayerFriendshipCB(source, identity))

export const sendUserFriendInvitationCB = async (source: number, identity: number) => {
  const senderLicense = getPlayerLicense(source)

  const senderRow = await getSingleRow<{ identity: number, outgoingInvitations: number[] }>('identity, outgoingInvitations', 'tr_pvpmodes_users', 'license = ?', senderLicense)
  if (!senderRow) return
  const receiverRow = await getSingleRow<{ incomingInvitations: number[] }>('incomingInvitations', 'tr_pvpmodes_users', 'identity = ?', identity)
  if (!receiverRow) return
  const senderidentity = senderRow.identity
  const senderOutgoingInvitations = senderRow.outgoingInvitations
  const receiverIncomingInvitations = receiverRow.incomingInvitations

  senderOutgoingInvitations.push(identity)
  receiverIncomingInvitations.push(senderidentity)

  const outgoingUpdated = await updateRow('tr_pvpmodes_users', 'outgoingInvitations', 'license = ?', JSON.stringify(senderOutgoingInvitations), senderLicense)
  const incomingUpdated = await updateRow('tr_pvpmodes_users', 'incomingInvitations', 'identity = ?', JSON.stringify(receiverIncomingInvitations), identity)

  return outgoingUpdated && incomingUpdated
}

onPromise('tr_pvpmodes/server/competitive/sendUserFriendInvitation', async (source, identity: number) => sendUserFriendInvitationCB(source, identity))