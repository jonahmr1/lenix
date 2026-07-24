import { useState, useRef, useEffect } from "react"
import Button from "../../wrappers/button"
import type { Configs, GetRef, RangeValues } from "../../types"
import { onClick } from "../.."

const getStorage = (command: string, min: number, max: number): RangeValues => {
  const storage = localStorage.getItem("rangeValues")
  if (storage) return JSON.parse(storage)
  else {
    saveStorage({
      [command]: (min + max) / 2
    })
    return getStorage(command, min, max)
  }
}

const saveStorage = (rangeValues: RangeValues) => {
  localStorage.setItem("rangeValues", JSON.stringify(rangeValues))
}

const Range = ({
  range: {
    min, max, unlimitedPositive
  }, command
}: {
  range: Configs["StaticRangeType"]
  command: string
}) => {
  const style = "px-2 bg-stone-600 rounded-md cursor-default"
  const defaultRanges = getStorage(command, min, max)
  const [rangeValues, setRangeValues] = useState<RangeValues>(defaultRanges)
  const timerRef = useRef(0)

  useEffect(() => {
    saveStorage(rangeValues)
  }, [rangeValues])

  const startHolding = (
    direction: number,
    rangeValue: number
  ) => {
    setRangeValues(prev => ({...prev, [command]: rangeValue}))
    timerRef.current = setInterval(() => {
      setRangeValues(prev => ({...prev, [command]: Math.max(0, prev ? prev[command] + direction : 0 + direction)}))
    }, 100)
  }

  const stopHolding = (timerRef: GetRef<number>) => {
    clearInterval(timerRef.current)
  }
  if (rangeValues[command] === undefined) {
    const value = (min + max) / 2
    saveStorage({...rangeValues, [command]: value})
    setRangeValues(prev => ({...prev, [command]: value}))
  }

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="range">{(rangeValues[command])?.toFixed(1)}</label>
      <div className="flex gap-1">
        {unlimitedPositive && (
          <Button
            label="-"
            style={style}
            onMouseDown={() => startHolding(-1, rangeValues[command] > 1 ? rangeValues[command] - 1 : 0)}
            stopHolding={() => stopHolding(timerRef)}
          />
        )}
        <input
          id={command}
          type="range"
          step="0.1"
          min={min}
          max={max}
          value={rangeValues[command]}
          onChange={({ target: { value } }) => {
            const newValue = Number(value)
            setRangeValues({...rangeValues, [command]: newValue})
            onClick(command, String(newValue))
          }}
        />
        {unlimitedPositive && (
          <Button
            label="+"
            style={style}
            onMouseDown={() => startHolding(1, rangeValues[command] + 1)}
            stopHolding={() => stopHolding(timerRef)}
          />
        )}
      </div>
    </div>
  )
}

export default Range