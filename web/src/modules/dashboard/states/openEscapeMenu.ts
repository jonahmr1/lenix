import { triggerNuiCallback } from "@trippler/tr_lib/web"
import alert from "../../../components/dashboard/alert"

export default () => {
  const [ alertElement, _alertIndex ] = alert({
    type: "info",
    title: "Leave Competitive Mode?",
    message: "Are you sure you want to leave Competitive Mode?",
    buttons: [
      {
        content: "Cancel",
        type: "primary",
        onClick: () => alertElement.remove()
      },
      {
        content: "Leave",
        type: "soft",
        onClick: () => {
          alertElement.remove()
          triggerNuiCallback('dashboard/leaveGame')
        }
      }
    ]
  })
}