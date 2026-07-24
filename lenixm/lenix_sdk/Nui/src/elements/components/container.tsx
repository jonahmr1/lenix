import type { Children } from "../../types"

const Container = ({ children, displayState }: { children: Children, displayState: boolean }) =>
<div id="Container" className={`${displayState ? '' : 'hidden'}`}>
  { children }
</div>

export default Container