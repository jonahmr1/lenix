import { triggerPromise } from '@trippler/tr_lib/client'
import {
  AcceptFriendship,
  CancelOutgoingFriendship,
  GetFriendablePlayers,
  GetIncomingFriends,
  GetOutgoingFriends,
  GetPlayerFriends,
  RemoveIncomingRequest,
  RemovePlayerFriendship,
  SendUserFriendInvitation,
  CreateUserIntoTheDatabase,
  DoesUserAlreadyExist,
  GetUserProfile
} from '../../../shared/types/competitive'

export const doesUserAlreadyExist = () => triggerPromise<DoesUserAlreadyExist>('competitive/dashboard/doesUserAlreadyExist')
export const getUserProfile = (identity: number) => triggerPromise<GetUserProfile>('competitive/dashboard/getUserProfile', identity)
export const createUser = (name: string, avatar: string) => triggerPromise<CreateUserIntoTheDatabase>('competitive/dashboard/createUser', name, avatar)
export const acceptFriendship = (identity: number) => triggerPromise<AcceptFriendship>('competitive/dashboard/acceptFriendship', identity)
export const getPlayerFriends = () => triggerPromise<GetPlayerFriends>('competitive/dashboard/getPlayerFriends')
export const getIncomingFriends = () => triggerPromise<GetIncomingFriends>('competitive/dashboard/getIncomingFriends')
export const getOutgoingFriends = () => triggerPromise<GetOutgoingFriends>('competitive/dashboard/getOutgoingFriends')
export const getFriendablePlayers = () => triggerPromise<GetFriendablePlayers>('competitive/dashboard/getFriendablePlayers')
export const removeIncomingRequest = (identity: number) => triggerPromise<RemoveIncomingRequest>('competitive/dashboard/removeIncomingRequest', identity)
export const removePlayerFriendship = (identity: number) => triggerPromise<RemovePlayerFriendship>('competitive/dashboard/removePlayerFriendship', identity)
export const cancelOutgoingFriendship = (identity: number) => triggerPromise<CancelOutgoingFriendship>('competitive/dashboard/cancelOutgoingFriendship', identity)
export const sendUserFriendInvitation = (identity: number) => triggerPromise<SendUserFriendInvitation>('competitive/dashboard/sendUserFriendInvitation', identity)