import openEscapeMenu from "../../components/competitive/dashboard/escapeMenu"
import { getState } from "../../../../tr_competitive/nui/src/states"

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