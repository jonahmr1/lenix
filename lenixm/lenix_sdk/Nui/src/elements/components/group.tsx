import type { Children } from "../../types"

const Groups = ({ children }: { children: Children }) =>
<div className={`flex flex-col gap-.2em`}>
  {children}
</div>

export default Groups