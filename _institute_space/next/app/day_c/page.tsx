'use client'

import { useState } from "react"

const colors = ['Red', 'Blue', 'Green', 'Black']

export default () => {
	const [state, setState] = useState(colors[0])
	
	return (
		<div>
			<p>the color is <span style={{
				color: state.toLowerCase()
			}}>{state}</span></p>
			{colors.filter(color => color !== state).map(color => (
				<button key={color} onClick={() => setState(color)}>{color}</button>
			))}
		</div>
	)
}