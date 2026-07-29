import type { ButtonTypes } from "../../types"

const Button = ({
  label,
  style,
  id,
  type = 'button',
  onMouseDown,
  stopHolding
}: {
  label?: string
  style?: string
  id?: string
  type?: ButtonTypes
  onMouseDown?: () => void
  stopHolding?: () => void
}) => 
<button
  type={type}
  id={id}
  className={style}
  onMouseDown={onMouseDown}
  onMouseLeave={stopHolding}
  onMouseUp={stopHolding}
>{label}</button>

export default Button