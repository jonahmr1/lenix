import openEscapeMenu from "../../components/competitive/dashboard/escapeMenu"
import { getState } from "../../states/competitive"

export default (count: number) => {
  const friendsBTN = document.getElementById('friendsButton')
  friendsBTN ? friendsBTN.textContent = `👥 | ${count}` : null
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && getState.dashboardOn) openEscapeMenu()
})