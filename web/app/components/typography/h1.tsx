import type { Children } from "~/types.ts";

export const H1 = ({ children }: Children) => (
	<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
		{children}
	</h1>
)
