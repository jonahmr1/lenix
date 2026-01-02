import onNuiCallback from "../nuiCallback/onNuiCallback"

let domLoaded = false
const waitingCallbacks: Array<() => void> = []

onNuiCallback('__DOMLoaded', () => {
  domLoaded = true
  waitingCallbacks.forEach(fn => fn())
  waitingCallbacks.length = 0
})

export default (Function: () => void) => {
  return new Promise(resolve => {
    if (domLoaded) {
      Function()
      resolve(true)
    } else {
      waitingCallbacks.push(() => {
        Function()
        resolve(true)
      })
    }
  })
}