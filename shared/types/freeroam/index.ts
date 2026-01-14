export interface Suggestion {
  name: string
  help: string | undefined
  params: Array<{
    name: string
    help: string | undefined
    optional: boolean | undefined
    type: `playerId` | `string` | `number`
  }>
}

export interface Message {
  args: Array<string>
  template?: string
  params?: { [key: string]: string }
  multiline?: boolean
  color?: [ number, number, number ]
  templateId?: number
  mode?: string
  modeData?: {
    name: string
    displayName: string
    color: string
    hidden?: boolean
    isChannel?: boolean
    isGlobal?: boolean
  }

  id?: string
}

export type CommandName = Suggestion['name']