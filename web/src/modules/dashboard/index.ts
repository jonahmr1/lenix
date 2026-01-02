import { nuiFocus, triggerNuiCallback } from "@trippler/tr_lib/web"
import { AcceptFriendship, GetPlayerFriends } from "../../../../shared/types"
import createFriendItem from "./createFriendItem"
import refreshFriends from "..//../dom/dashboard"
import { setState } from "../../states"

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

export const closeDashboard = async (fromEvent?: boolean) => {
  setState.dashboard(false)
  nuiFocus(false, false)
  if (!fromEvent) {
    const response = await triggerNuiCallback<boolean>('dashboard/closeGame')
    if (!response) return
  }
  const root = document.getElementById('dashboard-root')
  if (root) {
    root.classList.add('hidden')
  }
}

export const hideDashboard = () => {
  nuiFocus(false, false)
  const root = document.getElementById('dashboard-root')
  root?.classList.add('hidden')
}

export const showDashboard = () => {
  nuiFocus(true, true)
  const root = document.getElementById('dashboard-root')
  root?.classList.remove('hidden')
}