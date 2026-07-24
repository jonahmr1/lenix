import { useState } from "react"
import type { Configs } from "../../types"
import Range from "./range"

const Radio = ({
  radios, range
} : {
  radios: Configs["RadiosType"], 
  range: Configs["StaticRangeType"]
}) => {
  const initialCommand = Object.values(radios).find(r => r.checked)?.command || 'null'
  const [selected, setSelected] = useState(initialCommand)
  return (
    <>
      <div className="flex gap-1 justify-center">
        {Object.entries(radios).map(([, { command, label }]) => (
          <div key={command}>
            <input
              type="radio"
              id={String(command)}
              name="name"
              value={command}
              checked={selected === command}
              onChange={() => setSelected(command)}
            />
            <label htmlFor={String(command)}>{label}</label>
          </div>
        ))}
      </div>
      <Range {...{ range, command: selected }} />
    </>
  )
}

export default Radio