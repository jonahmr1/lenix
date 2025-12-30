import nameSetup from "./name"
import avatarSetup from "./avatar"
import Alert from "../../../components/dashboard/alert"
import { triggerNuiCallback } from "@trippler/tr_lib/web"

export default async (): Promise<{ userName: string, userAvatar: string }> => {
  const userName = await nameSetup()
  const userAvatar = await avatarSetup()
  
  if (typeof userName === 'string' && typeof userAvatar === 'string') {
    return new Promise(resolve => {
      const [success, _successIndex] = Alert({
        type: "success",
        title: "success",
        message: "Your profile has been successfully set, Welcome on board!",
        button: "Get Started",
        onClick: () => {
          success.remove()
          triggerNuiCallback('startCharacterProcess')
          resolve({ userName, userAvatar })
        }
      })
    })
  }
  
  throw new Error("Invalid setup data")
}