import { useAlert } from '@lenixdev/fusion/nui'
import { nuiFocus, triggerNuiCallback } from '@trippler/tr_lib/nui'

let menuState = false
let lastElement: HTMLElement | null = null

export default () => {
  if (!menuState) {
    const [alertElement, _alertIndex] = useAlert({
      title: "Leave Freeroam Mode",
      message: "Are you sure you want to leave freeroam mode?",
      type: "info",
      buttons: [
        {
          content: "Cancel",
          type: "primary",
          onClick: () => {
            alertElement.remove()
            nuiFocus(false, false)
            menuState = false
          }
        },
        {
          content: "Leave",
          type: "soft",
          onClick: () => {
            alertElement.remove()
            nuiFocus(false, false)
            triggerNuiCallback("competitive/spawn/leaveFreeroam")
            menuState = false
          }
        }
      ]
    })
    lastElement = alertElement
    menuState = true
  } else {
    lastElement?.remove()
    menuState = false
    nuiFocus(false, false)
  }
}