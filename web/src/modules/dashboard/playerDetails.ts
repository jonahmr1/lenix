import { getUserProfile } from '../../api/dashboard'
import updatePlayerCard from '../../elements/header/player/card'

export default class playerDetails {
  private name: string = 'undefined'
  private avatar: string = 'undefined'
  private id: number = -1

  public async getUserDetails(identity: number, self?: boolean) {
    const user = await getUserProfile(identity)
    this.id = identity
    this.name = user!.name
    this.avatar = user!.avatar

    if (self) {
      updatePlayerCard(identity)
    }

    return { name: this.name, avatar: this.avatar , id: this.id }
  }
}