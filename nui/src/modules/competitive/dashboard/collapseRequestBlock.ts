import { getState, setState } from "../../../states/competitive"

const collapse = (requests: HTMLDivElement) => {
  document.getElementById('friendsContainer')?.classList.remove("hidden")
  requests.classList.remove("-bottom-[0%]")
  requests.classList.add("-bottom-[80%]")
  setState.requestBlockCoollapsed(true)
}

const expand = (requests: HTMLDivElement) => {
  document.getElementById('friendsContainer')?.classList.add("hidden")
  requests.classList.remove("-bottom-[80%]")
  requests.classList.add("-bottom-[0%]")
  setState.requestBlockCoollapsed(false)
}

export default (state?: boolean) => {
  const requests = document.getElementById('friendsRequests') as HTMLDivElement

  if (state === true) {
    if (getState.requestBlockCoollapsed) return
    collapse(requests)
  } else if (state === false) {
    if (!getState.requestBlockCoollapsed) return
    expand(requests)
  } else if (getState.requestBlockCoollapsed) {
    expand(requests)
  }
}