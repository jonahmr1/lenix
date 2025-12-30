import { onPromise, triggerPromise } from "@trippler/tr_lib/server"
import { fatal, split } from "@trippler/tr_lib/shared"
import { info } from "console"
import fetchDiscordServer from "../services/chat"

onPromise('createNewMessageRequest', (senderSource, message: string) => {
  try {
    playersSources.forEach(async source => {
      const discordId = GetPlayerIdentifierByType(senderSource as any, 'discord')
      if (!discordId) {
        info(`could not retrieve the sender ${GetPlayerName(senderSource as any)} [#id: ${senderSource}]'s discord Id`)
        return false
      }
      const userDiscordId = split(discordId, ':')[1]
      const userRole = await fetchDiscordServer(userDiscordId)
      if (!userRole) {
        info(`could not retrieve the sender ${GetPlayerName(senderSource as any)} [#id: ${senderSource}]'s role`)
        return false
      }
      triggerPromise('createNewMessage', source, message, userRole)
    })
    return true
  } catch (error) {
    throw fatal(error)
  }
})


export const playersSources: number[] = []

on("playerDropped", (_reason: string, _resourceName: string, _clientDropReason: number) => {
  playersSources.splice(playersSources.indexOf(source), 1)
});

on("playerJoining", (_source: number, oldID: string) => {
  playersSources.push(source)
});

on("onResourceStop", (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) return
  fatal("tr_freeroam caught stopping, please restart your server")
})