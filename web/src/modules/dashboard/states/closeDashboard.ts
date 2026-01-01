import { triggerNuiCallback } from "@trippler/tr_lib/web"

export default async (fromEvent?: boolean) => {
  if (!fromEvent) {
    const response = await triggerNuiCallback<boolean>('dashboard/closeGame')
    if (!response) return
  }
  const root = document.getElementById('dashboard-root')
  if (root) {
    root.classList.add('hidden')
  }
}