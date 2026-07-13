import type React from 'react'

export const Lead = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='text-xl text-foreground'>{children}</p>
)
