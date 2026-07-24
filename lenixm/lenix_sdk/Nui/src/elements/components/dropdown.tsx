import type { States, Children, SetState } from "../../types"
import { keepOthersExpandedOnSelect } from "../.."
import Button from "../../wrappers/button"

const Dropdown = ({
  children,
  label,
  id,
  style,
  buttonsStates,
  setButtonsStates
}: {
  children: Children,
  label: string,
  id?: string,
  style?: string,
  buttonsStates: States,
  setButtonsStates: SetState<States>
}) =>
<div className={`${style} flex flex-col`}>
  <Button
    id={id}
    label={buttonsStates?.[label] ? `⬇︎ ${label} ⬇︎` : `→ ${label} ←`}
    style={`${buttonsStates?.[label] ? 'bg-stone-400' : 'bg-stone-500'}`}
    onMouseDown={
      () => {
      setButtonsStates({
        ...(keepOthersExpandedOnSelect ? buttonsStates : {}),
        [label]: !buttonsStates?.[label]
      })
    }}
  />
  {buttonsStates?.[label] && (
    children
  )}
</div>

export default Dropdown