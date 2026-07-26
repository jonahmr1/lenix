import type { Dispatch, SetStateAction } from "react"

interface Range {
  min: number
  max: number
  unlimitedPositive?: boolean
}

type Children = React.ReactNode

type ExecuteCallback<T> = (command: string, parameters?: string | string[]) => T
type States = Record<string, boolean> | null
type SetState<S> = Dispatch<SetStateAction<S>>
type RangeValues = Record<string, number>
type ButtonTypes = React.ButtonHTMLAttributes<HTMLButtonElement>['type']
type GeneratedButtons = Record<string, string>
type GetRef<T> = React.RefObject<T>
type Configs = {
  InputArgs: Config["dropdown"]["input"][string]["args"]
  StaticRangeType: Config["dropdown"]["range"]["static"][string]["range"]
  RadiosType: Config["dropdown"]["range"]["radio"][number]["radios"]
  InputDropdownType: Config["dropdown"]["input"]
  RangeDropdownType: Config["dropdown"]["range"]["static"]
  RadioDropdownType: Config["dropdown"]["range"]["radio"]
}

type StaticButtonFeature = [string, string][]
type DynamicButtonFeature = [string, string][]
type InputDropdownFeature = [string, {
  label: string
  args?: {
    placeholder: string
    required?: boolean
    storageSave?: string
  }[]
}][]

type RangeDropdownFeature = [string, {
  label: string
  range: {
    min: number
    max: number
    unlimitedPositive?: boolean
  }
}][]

type RadioDropdownFeature = [string, {
  label: string;
  range: {
    min: number
    max: number
    unlimitedPositive?: boolean
  };
  radios: Array<{
    command: string;
    label: string;
    checked?: boolean;
  }>
}][]

interface Config {
  staticButton: {
    [key: string]: string
  }
  dynamicButton: {
    [key: string]: string
  }
  dropdown: {
    input: {
      [key: string]: {
        label: string
        args?: {
          placeholder: string
          required?: boolean
          storageSave?: string
        }[]
      }
    }
    range: {
      static: {
        [key: string]: {
          label: string
          range: Range
        }
      }
      radio: Array<{
        label: string
        range: Range
        radios: Array<{
          command: string
          label: string
          checked?: boolean
        }>
      }>
    }
  }
}

export type {
  Config,
  Children,
  Configs,
  States,
  SetState,
  RangeValues,
  ButtonTypes,
  GeneratedButtons,
  GetRef,
  ExecuteCallback,
  DynamicButtonFeature,
  StaticButtonFeature,
  InputDropdownFeature,
  RangeDropdownFeature,
  RadioDropdownFeature
}