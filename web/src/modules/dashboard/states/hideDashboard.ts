import { nuiFocus } from "@trippler/tr_lib/web"

export default () => {
  nuiFocus(false, false)
  const root = document.getElementById('dashboard-root')
  root?.classList.add('hidden')
}