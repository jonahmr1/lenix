let isRequestsBlockCollapsed = true

const collapse = (requests: HTMLDivElement) => {
  document.getElementById('friendsContainer')?.classList.remove("hidden")
  requests.classList.remove("-bottom-[0%]")
  requests.classList.add("-bottom-[80%]")
  isRequestsBlockCollapsed = true
}

const expand = (requests: HTMLDivElement) => {
  document.getElementById('friendsContainer')?.classList.add("hidden")
  requests.classList.remove("-bottom-[80%]")
  requests.classList.add("-bottom-[0%]")
  isRequestsBlockCollapsed = false
}

export default (state?: boolean) => {
  const requests = document.getElementById('friendsRequests') as HTMLDivElement

  if (state === true) {
    if (isRequestsBlockCollapsed) return
    collapse(requests)
  } else if (state === false) {
    if (!isRequestsBlockCollapsed) return
    expand(requests)
  } else if (isRequestsBlockCollapsed) {
    expand(requests)
  }
}