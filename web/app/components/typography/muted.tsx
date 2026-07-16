import type { Children } from "~/types.ts";

export const Muted = ({ children }: Children) => (
	<p className='text-sm text-muted-foreground'>{children}</p>
)
