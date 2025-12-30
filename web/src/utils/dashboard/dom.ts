import closeDashboard from "../../modules/dashboard/states/closeDashboard"
import { isDashboardOn } from "./variables"

export default (count: number) => {
  const friendsBTN = document.getElementById('friendsButton')
  friendsBTN ? friendsBTN.textContent = `👥 | ${count}` : null
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (isDashboardOn) {
      closeDashboard()
    }
  }
})