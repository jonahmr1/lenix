import type React from 'react'

export const Muted = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
	<p className='text-sm text-muted-foreground'>{children}</p>
)
