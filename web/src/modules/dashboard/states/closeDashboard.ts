import { nuiFocus, triggerNuiCallback } from "@trippler/tr_lib/web"
import { setDashboardState } from "../../../hooks/dashboard"

export default async (fromEvent?: boolean) => {
  setDashboardState(false)
  nuiFocus(false, false)
  if (!fromEvent) {
    const response = await triggerNuiCallback<boolean>('dashboard/closeGame')
    if (!response) return
  }
  const root = document.getElementById('dashboard-root')
  if (root) {
    root.classList.add('hidden')
  }
}