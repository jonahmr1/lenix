import { onPromise } from '@trippler/tr_lib/server'
import { getSingleRow, updateRow, getSingleColumn } from '../database/queries'
import getPlayerLicense from '../utils/getPlayerLicense'
import { createUserIntoTheDatabase, doesUserAlreadyExist } from '../services/dashboard'

export const getUserProfileCB = async (identity: number) => {
  const response = await getSingleRow<{ name: string, avatar: string }>('name, avatar', 'tr_competitive_users', 'identity = ?', identity)
  return response && { ...response }
}

onPromise('createUser', (source, name: string, avatar: string) => createUserIntoTheDatabase(getPlayerLicense(source), name, avatar))
onPromise('doesUserAlreadyExist', (source) => doesUserAlreadyExist(source))
onPromise('getUserProfile', async (_source, identity: number) => getUserProfileCB(identity))

export const acceptFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number; friends: number[] }>('identity, friends', 'tr_competitive_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ friends: number[] }>('friends', 'tr_competitive_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.friends
  const receiverRequests = receiverResponse.friends
  senderRequests.push(identity)
  receiverRequests.push(senderId)

  const senderAffectedColumn = await updateRow('tr_competitive_users', 'friends', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_competitive_users', 'friends', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('acceptFriendship', async (source, identity: number) => acceptFriendshipCB(source, identity))

export const cancelOutgoingFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number; outgoingInvitations: number[] }>('identity, outgoingInvitations', 'tr_competitive_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ incomingInvitations: number[] }>('incomingInvitations', 'tr_competitive_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.outgoingInvitations
  const receiverRequests = receiverResponse.incomingInvitations
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)
  
  const senderAffectedColumn = await updateRow('tr_competitive_users', 'outgoingInvitations', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_competitive_users', 'incomingInvitations', 'identity = ?', JSON.stringify(receiverRequests), identity) 
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('cancelOutgoingFriendship', (source, identity: number) => cancelOutgoingFriendshipCB(source, identity))

export const getFriendablePlayersCB = async (source: number) => {
  const license = getPlayerLicense(source)
  const senderRow = await getSingleRow<{ identity: number; friends: number[]; incomingInvitations: number[]; outgoingInvitations: number[] }>('identity, friends, outgoingInvitations, incomingInvitations', 'tr_competitive_users', 'license = ?', license)
  if (!senderRow) return
  const senderidentity = senderRow.identity
  const senderFriends = senderRow.friends
  const senderIncomingRequests = senderRow.incomingInvitations
  const senderOutgoingRequests = senderRow.outgoingInvitations

  const serverUsers = await getSingleColumn<{ identity: number }>('identity', 'tr_competitive_users')
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

onPromise('getFriendablePlayers', async (source) => getFriendablePlayersCB(source))

export const getOutgoingFriendsCB = async (source: number) => {
  const response = await getSingleRow<{ outgoingInvitations: number[] }>('outgoingInvitations', 'tr_competitive_users', 'license = ?', getPlayerLicense(source))
  return response ? response.outgoingInvitations : []
}

onPromise('getOutgoingFriends', async (source) => getOutgoingFriendsCB(source))

export const getPlayerFriendsCB = async (source: number) => {
  const response = await getSingleRow<{ friends: number[] }>('friends', 'tr_competitive_users', 'license = ?', source)
  return response ? response.friends : []
}

onPromise('getPlayerFriends', async (source) => getPlayerFriendsCB(source))

export const getIncomingFriendsCB = async () => {
  const response = await getSingleRow<{ incomingInvitations: number[] }>('incomingInvitations', 'tr_competitive_users', 'license = ?', getPlayerLicense(source))
  return response ? response.incomingInvitations : []
}

onPromise('getIncomingFriends', getIncomingFriendsCB)

export const removeIncomingRequestCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number; incomingInvitations: number[] }>('identity, incomingInvitations', 'tr_competitive_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ outgoingInvitations: number[] }>('outgoingInvitations', 'tr_competitive_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.incomingInvitations
  const receiverRequests = receiverResponse.outgoingInvitations
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)

  const senderAffectedColumn = await updateRow('tr_competitive_users', 'incomingInvitations', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_competitive_users', 'outgoingInvitations', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('removeIncomingRequest', async (source, identity: number) => removeIncomingRequestCB(source, identity))

export const removePlayerFriendshipCB = async (source: number, identity: number) => {
  const license = getPlayerLicense(source)
  const senderResponse = await getSingleRow<{ identity: number; friends: number[] }>('identity, friends', 'tr_competitive_users', 'license = ?', license)
  if (!senderResponse) return
  const receiverResponse = await getSingleRow<{ friends: number[] }>('friends', 'tr_competitive_users', 'identity = ?', identity)
  if (!receiverResponse) return

  const senderId = senderResponse.identity
  const senderRequests = senderResponse.friends
  const receiverRequests = receiverResponse.friends
  senderRequests.splice(senderRequests.indexOf(identity), 1)
  receiverRequests.splice(receiverRequests.indexOf(senderId), 1)

  const senderAffectedColumn = await updateRow('tr_competitive_users', 'friends', 'license = ?', JSON.stringify(senderRequests), license)
  const receiverAffectedColumn = await updateRow('tr_competitive_users', 'friends', 'identity = ?', JSON.stringify(receiverRequests), identity)
  return senderAffectedColumn && receiverAffectedColumn
}

onPromise('removePlayerFriendship', async (source, identity: number) => removePlayerFriendshipCB(source, identity))

export const sendUserFriendInvitationCB = async (source: number, identity: number) => {
  const senderLicense = getPlayerLicense(source)

  const senderRow = await getSingleRow<{ identity: number; outgoingInvitations: number[] }>('identity, outgoingInvitations', 'tr_competitive_users', 'license = ?', senderLicense)
  if (!senderRow) return
  const receiverRow = await getSingleRow<{ incomingInvitations: number[] }>('incomingInvitations', 'tr_competitive_users', 'identity = ?', identity)
  if (!receiverRow) return
  const senderidentity = senderRow.identity
  const senderOutgoingInvitations = senderRow.outgoingInvitations
  const receiverIncomingInvitations = receiverRow.incomingInvitations

  senderOutgoingInvitations.push(identity)
  receiverIncomingInvitations.push(senderidentity)

  const outgoingUpdated = await updateRow('tr_competitive_users', 'outgoingInvitations', 'license = ?', JSON.stringify(senderOutgoingInvitations), senderLicense)
  const incomingUpdated = await updateRow('tr_competitive_users', 'incomingInvitations', 'identity = ?', JSON.stringify(receiverIncomingInvitations), identity)

  return outgoingUpdated && incomingUpdated
}

onPromise('sendUserFriendInvitation', async (source, identity: number) => sendUserFriendInvitationCB(source, identity))