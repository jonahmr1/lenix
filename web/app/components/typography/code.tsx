import type { Children } from "~/types.ts";

export const Code = ({ children }: Children) => (
	<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
		{children}
	</code>
)
