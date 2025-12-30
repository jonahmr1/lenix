import initOnBoarding from '../onBoard'
import { createUser } from '../../../api/dashboard'
import playerDetails from '../playerDetails'

export default async (identity: number | boolean) => {
  const root = document.getElementById('root')
  if (!identity) {
    const { userName, userAvatar } = await initOnBoarding()
    const identity = await createUser(userName, userAvatar)
    new playerDetails().getUserDetails(identity, true)
  } else {
    new playerDetails().getUserDetails(identity as number, true)
  }
  root?.classList.remove('hidden')
}