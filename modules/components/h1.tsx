import type React from 'react'

export const H1 = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
		{children}
	</h1>
)
