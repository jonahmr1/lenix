import React from 'react'

export const P = ({ children }: { children: React.ReactNode }) => (
	<p className='leading-7 not-first:mt-6'>{children}</p>
)
