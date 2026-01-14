import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import alert from "./alert"

let menuState = false
let lastElement: HTMLElement | null

export default () => {
  if (!menuState) {
    const [ alertElement, _alertIndex ] = alert({
      type: "info",
      title: "Leave Competitive Mode?",
      message: "Are you sure you want to leave Competitive Mode?",
      buttons: [
        {
          content: "Cancel",
          type: "primary",
          onClick: () => {
            alertElement.remove()
            menuState = false
          }
        },
        {
          content: "Leave",
          type: "soft",
          onClick: () => {
            alertElement.remove()
            triggerNuiCallback('dashboard/leaveGame')
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
  }
}