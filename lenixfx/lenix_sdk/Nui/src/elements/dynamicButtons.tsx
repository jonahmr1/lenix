import { useState } from "react"
import type { DynamicButtonFeature, States } from "../types"
import Button from "../wrappers/button"
import { onClick } from ".."

const DynamicButtons = ({ feature }: {
  feature: DynamicButtonFeature
}) => {
  const [states, setStates] = useState<States>(null)

  const toggleBoolState = (command: string) => {
    setStates({ ...states, [command]: !states?.[command] })
    return !states?.[command]
  }

  return feature.map(([command, key], i) => {
    const onMouseDown = () => (toggleBoolState(command), onClick(command, String(states?.[command])))
    const style = states?.[command] ? "bg-green-500" : "bg-red-500"
    return <Button
      key={i}
      {...{ label: key, onMouseDown, style: style + " text-white" }}
    />
  })
}

export default DynamicButtons