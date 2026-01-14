import { getSingleRow, insertNewRow } from '../../database/competitive/queries'
import getPlayerLicense from '../../utils/competitive/getPlayerLicense'

export const doesUserAlreadyExist = async (source: number) => {
  const response = await getSingleRow<{ identity: number }>('identity', 'tr_competitive_users', 'license = ?', getPlayerLicense(source))
  return response && response.identity
}

export const createUserIntoTheDatabase = (license: string, name: string, avatar: string) => insertNewRow(
  'tr_competitive_users',
  'license, name, avatar, friends, incomingInvitations, outgoingInvitations',
  '?, ?, ?, ?, ?, ?',
  license,
  name,
  avatar,
  JSON.stringify([]),
  JSON.stringify([]),
  JSON.stringify([])
)