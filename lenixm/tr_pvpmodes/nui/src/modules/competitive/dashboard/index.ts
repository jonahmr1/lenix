import { nuiFocus, triggerNuiCallback } from "@trippler/tr_lib/nui"
import { AcceptFriendship, GetPlayerFriends } from "../../../../../shared/types/competitive"
import createFriendItem from "./createFriendItem"
import refreshFriends from "../../../../../nui/src/dom/competitive/dashboard"
import { setState } from "../../../states/competitive"

export const acceptFriendship = async (identity: number) => {
  const response = await triggerNuiCallback<AcceptFriendship>('competitive/dashboard/acceptFriendship', {identity})
  if (!response) return
  createFriendItem(identity)
  return true
}

export const getPlayerFriends = async () => {
  const friends = await triggerNuiCallback<GetPlayerFriends>('competitive/dashboard/getPlayerFriends')
  refreshFriends((friends as number[])?.length)
  return friends
}

export const closeDashboard = async (fromEvent?: boolean) => {
  setState.dashboard(false)
  nuiFocus(false, false)
  if (!fromEvent) {
    const response = await triggerNuiCallback<boolean>('competitive/dashboard/closeGame')
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