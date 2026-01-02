import { triggerNuiCallback } from "@trippler/tr_lib/web"
import { AcceptFriendship, GetPlayerFriends } from "../../../../shared/types"
import createFriendItem from "./createFriendItem"
import refreshFriends from "..//../dom/dashboard"

export const acceptFriendship = async (identity: number) => {
  const response = await triggerNuiCallback<AcceptFriendship>('dashboard/acceptFriendship', {identity})
  if (!response) return
  createFriendItem(identity)
  return true
}

export const getPlayerFriends = async () => {
  const friends = await triggerNuiCallback<GetPlayerFriends>('dashboard/getPlayerFriends')
  refreshFriends((friends as number[])?.length)
  return friends
}