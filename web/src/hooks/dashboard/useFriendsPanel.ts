import updateRequestBlockState from "./useCollapse"

let friendsPanelCollapsed = true
let isFriendsListSelected = true
let requestsBlockSelected = "incoming"

export const useFriendsPanel = () => {
  const friendsPanelClass = document.getElementById('friendsPanel')?.classList
  if (friendsPanelCollapsed) {
    friendsPanelClass?.remove('right-[-80%]')
    friendsPanelClass?.add('right-[0]')
    friendsPanelCollapsed = false
  } else {
    friendsPanelClass?.remove('right-[0]')
    friendsPanelClass?.add('right-[-80%]')
    friendsPanelCollapsed = true
  }
}

export const useFriendsList = () => {
  const friendsClass = document.getElementById("friendsItems")?.classList
  const playersClass = document.getElementById("playersItems")?.classList
  const friendsheader = document.getElementById("friendsHeaderText")!
  if (isFriendsListSelected == true) {
    friendsClass?.add("hidden")
    playersClass?.remove("hidden")
    friendsheader.innerText = "Find Friends"
    isFriendsListSelected = false
  } else {
    friendsClass?.remove("hidden")
    playersClass?.add("hidden")
    friendsheader.innerText = "Friends List"
    isFriendsListSelected = true
  }
}

export const useRequestBlock = (state: boolean) => {
  const incomingClass = document.getElementById('incomingRequests')?.classList
  const outgoingClass = document.getElementById('outgoingRequests')?.classList
  const requestHeaderText = document.getElementById('requestsHeaderText')!
  const requestSwitchButton = document.getElementById('requestSwitchButton')!

  event?.stopPropagation();
  updateRequestBlockState(state)
  if (requestsBlockSelected == "incoming") {
    outgoingClass?.remove("hidden")
    incomingClass?.add("hidden")
    requestSwitchButton.innerText = "⏲️"
    requestHeaderText.innerText = "Outgoing Requests"
    requestsBlockSelected = "outgoing"
  } else {
    requestSwitchButton.innerHTML = "🕜"
    incomingClass?.remove("hidden")
    outgoingClass?.add("hidden")
    requestHeaderText.innerText = "Incoming Requests"
    requestsBlockSelected = "incoming"
  }
}