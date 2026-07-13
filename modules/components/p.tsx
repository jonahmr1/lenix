import type React from 'react'

export const P = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='leading-7 not-first:mt-6'>{children}</p>
)
