import {
  acceptFriendshipCB,
  cancelOutgoingFriendshipCB, 
  getFriendablePlayersCB, 
  getOutgoingFriendsCB, 
  getPlayerFriendsCB, 
  getIncomingFriendsCB, 
  removeIncomingRequestCB ,
  removePlayerFriendshipCB,
  sendUserFriendInvitationCB,
  getUserProfileCB
} from '../../../server/api/competitive/dashboard'
import { createUserIntoTheDatabase, doesUserAlreadyExist } from '../../../server/services/competitive/dashboard'

export interface ServerProfile {
  name: string
  avatar: string
}
export type PlayerObject = {
  name: string,
  role: {
    name: string,
    color: string,
  }
}

export type CreateUserIntoTheDatabase = ReturnType<typeof createUserIntoTheDatabase>
export type CreateUser = ReturnType<typeof createUserIntoTheDatabase>
export type GetUserProfile = ReturnType<typeof getUserProfileCB>
export type GetPlayerFriends = ReturnType<typeof getPlayerFriendsCB>
export type AcceptFriendship = ReturnType<typeof acceptFriendshipCB>
export type GetIncomingFriends = ReturnType<typeof getIncomingFriendsCB>
export type GetOutgoingFriends = ReturnType<typeof getOutgoingFriendsCB>
export type DoesUserAlreadyExist = ReturnType<typeof doesUserAlreadyExist>
export type GetFriendablePlayers = ReturnType<typeof getFriendablePlayersCB>
export type RemoveIncomingRequest = ReturnType<typeof removeIncomingRequestCB>
export type RemovePlayerFriendship = ReturnType<typeof removePlayerFriendshipCB>
export type CancelOutgoingFriendship = ReturnType<typeof cancelOutgoingFriendshipCB>
export type SendUserFriendInvitation = ReturnType<typeof sendUserFriendInvitationCB>