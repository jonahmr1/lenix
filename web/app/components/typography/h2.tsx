import type { Children } from "~/types.ts";

export const H2 = ({ children }: Children) => (
	<h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
		{children}
	</h2>
)
