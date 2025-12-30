import './dashboard'
import './chat'
import { lobbyCoords } from '../../shared/constants'
import { hideGame, showGame } from '../game'

export default async () => exports.tr_onboarding.startCharacterProcess(lobbyCoords, lobbyCoords, hideGame, showGame)