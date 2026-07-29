import { storageAddresses } from "../.."
import Button from "../../wrappers/button"

const ResetButton = () =>
<div className="flex flex-col">
  <Button
    label="Reset Dynamics"
    onMouseDown={() => {
      localStorage.removeItem(storageAddresses.dynamics)
    }}
  />
  <Button
    label="Reset Inputs"
    onMouseDown={() => {
      localStorage.removeItem(storageAddresses.inputs)
    }}
  />
  <Button
    label="Reset Ranges"
    onMouseDown={() => {
      localStorage.removeItem(storageAddresses.ranges)
    }}
  />
</div>
export default ResetButton