import type { RangeDropdownFeature, SetState, States } from "../types"
import Dropdown from "./components/dropdown"
import Range from "./components/range"

const DropdownRanges = ({
  feature, buttonsStates, setButtonsStates
}: {
  feature: RangeDropdownFeature
  buttonsStates: States
  setButtonsStates: SetState<States>
}) => feature.map(([command, { label, range }], i) => (
  <Dropdown
    key={i}
    style="text-white"
    {...{ label, buttonsStates, setButtonsStates }}
  >
    <Range {...{ range, command }} />
  </Dropdown>
))

export default DropdownRanges