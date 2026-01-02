import onNuiCallback from "../nuiCallback/onNuiCallback"

let domLoaded = false
onNuiCallback('__DOMLoaded', () => domLoaded = true)

export default (Function: () => void): Promise<boolean> => {
  return new Promise(resolve => {
    if (domLoaded) {
      Function()
      resolve(true)
    } else {
      onNuiCallback('__DOMLoaded', () => {
        Function()
        resolve(true)
      })
    }
  })
}