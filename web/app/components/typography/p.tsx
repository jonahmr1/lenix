import type { Children } from "~/types.ts";

export const P = ({ children }: Children) => (
	<p className='leading-7 not-first:mt-6'>{children}</p>
)
