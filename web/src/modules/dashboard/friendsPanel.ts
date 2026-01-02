import { getState, setState } from "../../states"
import updateRequestBlockState from "./collapseRequestBlock"

export const useFriendsPanel = () => {
  const friendsPanelClass = document.getElementById('friendsPanel')?.classList
  if (getState.friendsPanelCollapsed) {
    friendsPanelClass?.remove('right-[-80%]')
    friendsPanelClass?.add('right-[0]')
    setState.friendsPanelCollapsed(false)
  } else {
    friendsPanelClass?.remove('right-[0]')
    friendsPanelClass?.add('right-[-80%]')
    setState.friendsPanelCollapsed(true)
  }
}

export const useFriendsList = () => {
  const friendsClass = document.getElementById("friendsItems")?.classList
  const playersClass = document.getElementById("playersItems")?.classList
  const friendsheader = document.getElementById("friendsHeaderText")!
  if (getState.isFriendsListSelected) {
    friendsClass?.add("hidden")
    playersClass?.remove("hidden")
    friendsheader.innerText = "Find Friends"
    setState.isFriendsListSelected(false)
  } else {
    friendsClass?.remove("hidden")
    playersClass?.add("hidden")
    friendsheader.innerText = "Friends List"
    setState.isFriendsListSelected(true)
  }
}

export const useRequestBlock = (state: boolean) => {
  const incomingClass = document.getElementById('incomingRequests')?.classList
  const outgoingClass = document.getElementById('outgoingRequests')?.classList
  const requestHeaderText = document.getElementById('requestsHeaderText')!
  const requestSwitchButton = document.getElementById('requestSwitchButton')!

  event?.stopPropagation()
  updateRequestBlockState(state)
  if (getState.requestsBlockSelected == "incoming") {
    outgoingClass?.remove("hidden")
    incomingClass?.add("hidden")
    requestSwitchButton.innerText = "⏲️"
    requestHeaderText.innerText = "Outgoing Requests"
    setState.requestsBlockSelected("outgoing")
  } else {
    requestSwitchButton.innerHTML = "🕜"
    incomingClass?.remove("hidden")
    outgoingClass?.add("hidden")
    requestHeaderText.innerText = "Incoming Requests"
    setState.requestsBlockSelected("incoming")
  }
}