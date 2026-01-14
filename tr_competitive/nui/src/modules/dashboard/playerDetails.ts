import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import { GetUserProfile } from "../../../../shared/types"

export default class playerDetails {
  private name: string = 'undefined'
  private avatar: string = 'undefined'
  private id: number = -1

  public async getUserDetails(identity: number, updateCard?: (name: string, avatar: string) => void) {
    const user = await triggerNuiCallback<GetUserProfile>('dashboard/getUserProfile', { identity })
    this.id = identity
    this.name = user!.name
    this.avatar = user!.avatar

    if (updateCard) {
      updateCard(this.name, this.avatar)
    }

    return { name: this.name, avatar: this.avatar, id: this.id }
  }
}