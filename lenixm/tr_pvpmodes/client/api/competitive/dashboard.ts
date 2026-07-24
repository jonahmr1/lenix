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

export const doesUserAlreadyExist = () => triggerPromise<DoesUserAlreadyExist>('tr_pvpmodes/server/competitive/doesUserAlreadyExist')
export const getUserProfile = (identity: number) => triggerPromise<GetUserProfile>('tr_pvpmodes/server/competitive/getUserProfile', identity)
export const createUser = (name: string, avatar: string) => triggerPromise<CreateUserIntoTheDatabase>('tr_pvpmodes/server/competitive/createUser', name, avatar)
export const acceptFriendship = (identity: number) => triggerPromise<AcceptFriendship>('tr_pvpmodes/server/competitive/acceptFriendship', identity)
export const getPlayerFriends = () => triggerPromise<GetPlayerFriends>('tr_pvpmodes/server/competitive/getPlayerFriends')
export const getIncomingFriends = () => triggerPromise<GetIncomingFriends>('tr_pvpmodes/server/competitive/getIncomingFriends')
export const getOutgoingFriends = () => triggerPromise<GetOutgoingFriends>('tr_pvpmodes/server/competitive/getOutgoingFriends')
export const getFriendablePlayers = () => triggerPromise<GetFriendablePlayers>('tr_pvpmodes/server/competitive/getFriendablePlayers')
export const removeIncomingRequest = (identity: number) => triggerPromise<RemoveIncomingRequest>('tr_pvpmodes/server/competitive/removeIncomingRequest', identity)
export const removePlayerFriendship = (identity: number) => triggerPromise<RemovePlayerFriendship>('tr_pvpmodes/server/competitive/removePlayerFriendship', identity)
export const cancelOutgoingFriendship = (identity: number) => triggerPromise<CancelOutgoingFriendship>('tr_pvpmodes/server/competitive/cancelOutgoingFriendship', identity)
export const sendUserFriendInvitation = (identity: number) => triggerPromise<SendUserFriendInvitation>('tr_pvpmodes/server/competitive/sendUserFriendInvitation', identity)