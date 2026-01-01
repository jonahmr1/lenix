import initOnBoarding from '../onBoard'
import { createUser } from '../../../api/dashboard'
import playerDetails from '../playerDetails'

export default async (identity: number | boolean) => {
  const root = document.getElementById('dashboard-root')
  const { updatePlayerCard } = await import("../../../elements/dashboard/header/player/card")
  if (!identity) {
    const { userName, userAvatar } = await initOnBoarding()
    const identity = await createUser(userName, userAvatar)
    new playerDetails().getUserDetails(identity, updatePlayerCard)
  } else {
    new playerDetails().getUserDetails(identity as number, updatePlayerCard)
  }
  root?.classList.remove('hidden')
}