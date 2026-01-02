import { nuiFocus } from "@trippler/tr_lib/web"

export default () => {
  nuiFocus(true, true)
  const root = document.getElementById('dashboard-root')
  root?.classList.remove('hidden')
}