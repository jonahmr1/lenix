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
} from '../../shared/types'

import { lobbyCoords } from '../../shared/constants'
import { hideGame, showGame } from '../game'

export const startCharacterProcess = async () => exports.tr_onboarding.startCharacterProcess(lobbyCoords, lobbyCoords, hideGame, showGame)
export const getUserProfile = (identity: number) => triggerPromise<GetUserProfile>('getUserProfile', identity)
export const doesUserAlreadyExist = () => triggerPromise<DoesUserAlreadyExist>('doesUserAlreadyExist')
export const createUser = (name: string, avatar: string) => triggerPromise<CreateUserIntoTheDatabase>('createUser', name, avatar)
export const acceptFriendship = (identity: number) => triggerPromise<AcceptFriendship>('acceptFriendship', identity)
export const getPlayerFriends = () => triggerPromise<GetPlayerFriends>('getPlayerFriends')
export const getIncomingFriends = () => triggerPromise<GetIncomingFriends>('getIncomingFriends')
export const getOutgoingFriends = () => triggerPromise<GetOutgoingFriends>('getOutgoingFriends')
export const getFriendablePlayers = () => triggerPromise<GetFriendablePlayers>('getFriendablePlayers')
export const removeIncomingRequest = (identity: number) => triggerPromise<RemoveIncomingRequest>('removeIncomingRequest', identity)
export const removePlayerFriendship = (identity: number) => triggerPromise<RemovePlayerFriendship>('removePlayerFriendship', identity)
export const cancelOutgoingFriendship = (identity: number) => triggerPromise<CancelOutgoingFriendship>('cancelOutgoingFriendship', identity)
export const sendUserFriendInvitation = (identity: number) => triggerPromise<SendUserFriendInvitation>('sendUserFriendInvitation', identity)