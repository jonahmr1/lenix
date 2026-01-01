import { isDashboardOn } from "../../hooks/dashboard"
import openEscapeMenu from "../../modules/dashboard/states/openEscapeMenu"

export default (count: number) => {
  const friendsBTN = document.getElementById('friendsButton')
  friendsBTN ? friendsBTN.textContent = `👥 | ${count}` : null
}

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (isDashboardOn) {
      openEscapeMenu()
    }
  }
})