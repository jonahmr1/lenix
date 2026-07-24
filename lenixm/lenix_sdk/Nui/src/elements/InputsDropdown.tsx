import type { InputDropdownFeature, SetState, States } from "../types"
import Dropdown from "./components/dropdown"
import Inputs from "./components/inputs"

const DropdownInputs = ({
  feature, buttonsStates, setButtonsStates
}: {
  feature: InputDropdownFeature
  buttonsStates: States
  setButtonsStates: SetState<States>
}) => feature.map(([command, { label, args }], i) => (
  <Dropdown
    key={i}
    style="text-white"
    {...{ label, buttonsStates, setButtonsStates }}
  >
    <Inputs {...{ args, command } }  />
  </Dropdown>
))

export default DropdownInputs