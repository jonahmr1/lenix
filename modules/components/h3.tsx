import type React from 'react'

export const H3 = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{children}</h3>
)
