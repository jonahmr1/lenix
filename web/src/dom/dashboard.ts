import openEscapeMenu from "../modules/dashboard/openEscapeMenu"
import { getState } from "../states"

export default (count: number) => {
  const friendsBTN = document.getElementById('friendsButton')
  friendsBTN ? friendsBTN.textContent = `👥 | ${count}` : null
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (getState.dashboardOn) {
      openEscapeMenu()
    }
  }
})