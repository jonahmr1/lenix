import initOnBoarding from '../onBoard'
import playerDetails from '../playerDetails'
import { nuiFocus, triggerNuiCallback } from '@trippler/tr_lib/web'
import { setDashboardState } from '../../../hooks/dashboard'
import { CreateUser } from '../../../../../shared/types'

const root = document.getElementById('dashboard-root')

export default async (identity: number | boolean) => {
  nuiFocus(true, true)
  const { updatePlayerCard } = await import("../../../elements/dashboard/header/player/card")
  if (typeof identity === 'number') {
    const response = await triggerNuiCallback<boolean>('dashboard/startCharacterProcess')
    if (!response) return
    new playerDetails().getUserDetails(identity as number, updatePlayerCard)
  } else {
    const { userName, userAvatar } = await initOnBoarding()
    const identity = await triggerNuiCallback<CreateUser>('dashboard/createUser', { name: userName, avatar: userAvatar })
    new playerDetails().getUserDetails(identity, updatePlayerCard)
  }
  setDashboardState(true)
  root?.classList.remove('hidden')
}