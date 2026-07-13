import type React from 'react'

export const Large = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<div className='text-lg font-semibold'>{children}</div>
)
