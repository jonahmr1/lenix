import type { Children } from "~/types.ts";

export const Lead = ({ children }: Children) => (
	<p className='text-xl text-foreground'>{children}</p>
)
