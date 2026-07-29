import { onClick } from ".."
import type { StaticButtonFeature } from "../types"
import Button from "../wrappers/button"

const StaticButtons = ({ feature }: { feature: StaticButtonFeature }) =>
feature.map(([command, key], i) =>
  <Button
    key={i}
    style="StaticButton"
    {...{ label: key, onMouseDown: () => onClick(command) }}
  />
)

export default StaticButtons