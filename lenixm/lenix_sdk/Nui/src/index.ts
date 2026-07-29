import { triggerNuiCallback } from "@trippler/tr_lib/nui"
import type { Config, ExecuteCallback } from "./types"

const keepOthersExpandedOnSelect = false
const storageAddresses = {
  inputs: 'generatedButtons',
  ranges: 'rangeValues',
  dynamics: ''
}

const onClick: ExecuteCallback<unknown> = (command: string, parameters?: string | string[]) => {
  const RawCommand = `${command} ${parameters ? (Array.isArray(parameters) ? parameters.join(' ') : parameters) : ''}`
  triggerNuiCallback('execute', { RawCommand })
}

const GetConfig = (search: string | null) => {
  /* 
    https://docs.fivem.net/docs/client-manual/console-commands/#devgui_cmd-path-command
    https://docs.fivem.net/docs/client-manual/console-commands/#devgui_cmd-path-command
  */
  const CONFIG: Config = {
    staticButton: {
      disconnect: 'Disconnect',
      storymode: 'Story Mode',
      cmdlist: 'Command List',
      list_aces: 'Show ACEs',
      list_principals: 'Show Principals',
      net_showCommands: 'Show Commands',
      net_showDrilldown: 'Show Drilldown',
      net_showTime: 'Show Time',
      netobjviewer_syncLog: 'Objects Viewer Sync Log',
      nui_devtools: 'NUI Devtools',
      r_disableRendering: 'Disable Rendering',
    },
    dynamicButton: {
      cl_drawfps: 'Fps',
      cl_drawperf: 'Performance',
      developer: 'Developer Logging',
      modelviewer: 'Model Viewer',
      netEventLog: 'Event Log',
      netgraph: 'Netgraph',
      netobjviewer: 'Net Object Viewer',
      resmon: 'Resource Monitor',
      se_debug: 'Debug',
      strdbg: 'Stream Debug',
      strlist: 'Stream List',
      strmem: 'Stream Memory',
      game_enableScaleformDebugLog: 'Enable Scaleform Debug Log',
      game_enableFlyThroughWindscreen: 'Enable Fly Through Windscreen',
      game_enablePlayerRagdollOnCollision: 'Enable Player Ragdoll On Collision',
      test_ace: 'Test ACE',
    },
    dropdown: {
      input: {
        bind: {
          label: 'Bind',
          args: [
            { placeholder: 'The keyboard bind to use only when that resource is started', required: false },
            { placeholder: 'The keyboard bind to use', required: true },
            { placeholder: 'The command to trigger', required: true, storageSave: 'unbind' }
          ],
        },
        unbind: {
          label: 'Unbind',
          args: [ { placeholder: 'The keyboard bind to unbind', required: true } ],
        },
        quit: {
          label: 'Quit',
          args: [ { placeholder: 'The reason for quitting', required: false } ],
        },
        con_miniconChannels: {
          label: 'Mini Console',
          args: [ { placeholder: '* = all messages | script:* = all messages from all scripts', required: true } ],
        },
        net_printOwner: {
          label: 'Print Owner Of Object ID',
          args: [ { placeholder: 'Object ID', required: true } ],
        },
        net_statsFile: {
          label: 'Stats File',
          args: [ { placeholder: 'Give a name to the stats file', required: true } ],
        },
        save_gta_cache: {
          label: 'Save GTA Cache',
          args: [ { placeholder: 'The name of the resource to save the cache from', required: true } ],
        },
        set: {
          label: 'Set a client var',
          args: [
            { placeholder: 'key', required: true }, { placeholder: 'value', required: true }
          ],
        },
        seta: {
          label: 'Set a client archived var',
          args: [
            { placeholder: 'key', required: true }, { placeholder: 'value', required: true }
          ],
        },
      },
      range: {
        static: {
          profile_sfxVolume: {
            label: 'Game Volume',
            range: { min: 0, max: 10, unlimitedPositive: true },
          },
        },
        radio: [
          {
            label: 'Music Volume',
            range: { min: 0, max: 10, unlimitedPositive: true },
            radios: [
              {
                command: "profile_musicVolume",
                label: "Singleplayer",
                checked: true
              },
              {
                command: "profile_musicVolumeInMp",
                label: "Multiplayer",
              }
            ]
          },
        ]
      }
    }
  } as const
  const searchLower = search ? search.toLowerCase() : ''
  const staticButtons = Object.fromEntries(
    Object.entries(CONFIG.staticButton).filter(([, val]) => 
      !search || val.toLowerCase().includes(searchLower)
    )
  )
  const dynamicButtons = Object.fromEntries(
    Object.entries(CONFIG.dynamicButton).filter(([, val]) => 
      !search || val.toLowerCase().includes(searchLower)
    )
  )
  const { inputs, ranges } = {
    inputs: Object.fromEntries(
      Object.entries(CONFIG.dropdown.input).filter(([, data]) => 
        !search || data.label.toLowerCase().includes(searchLower)
      )
    ),
    ranges: {
      statics: Object.fromEntries(
        Object.entries(CONFIG.dropdown.range.static).filter(([, data]) => 
          !search || data.label.toLowerCase().includes(searchLower)
        )
      ),
      radios: Object.fromEntries(
        Object.entries(CONFIG.dropdown.range.radio).filter(([, data]) => 
          !search || data.label.toLowerCase().includes(searchLower)
        )
      )
    }
  } as const

  const staticButtonFeatures = Object.entries({
    ...(staticButtons && { staticButton: staticButtons }),
  }).flatMap(([, feature]) => {
    return Object.entries(feature)
  })

  const dynamicButtonFeatures = Object.entries({
    ...(dynamicButtons && { dynamicButton: dynamicButtons }),
  }).flatMap(([, feature]) => {
    return Object.entries(feature)
  })

  const inputFeatures = Object.entries({
    ...(inputs && { input: inputs }),
  }).flatMap(([, feature]) => {
    return Object.entries(feature)
  })

  const rangeFeatures = Object.entries({
    ...(ranges.statics && { range: ranges.statics }),
  }).flatMap(([, feature]) => {
    return Object.entries(feature)
  })

  const radioFeatures = Object.entries({
    ...(ranges.radios && { radio: ranges.radios }),
  }).flatMap(([, feature]) => {
    return Object.entries(feature)
  })

  return {
    staticButtonFeatures,
    dynamicButtonFeatures,
    inputFeatures,
    rangeFeatures,
    radioFeatures,
  }
}

export {
  onClick,
  keepOthersExpandedOnSelect,
  storageAddresses,
  GetConfig
}