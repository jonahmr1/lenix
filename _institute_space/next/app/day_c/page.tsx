'use client'

import { useState } from "react"

const colors = ['Red', 'Blue', 'Green', 'Black']

const Order = ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>Order</button>
const Orders = ({ children }: { children: React.ReactNode }) => <p>Orders: {children}</p>

const Counter = () => {
	const [state, setState] = useState(0)

	return (
		<>
			<Order onClick={() => setState(prev => prev++)} />
			<Orders>{state}</Orders>
		</>
	)
}

export default () => {
	const [state, setState] = useState(colors[0])
	
	return (
		<div>
			<div>
				<h1>A</h1>
				<p>the color is <span style={{ color: state.toLowerCase() }}>{state}</span></p>
				{colors.filter(color => color !== state).map(color => (
					<button key={color} onClick={() => setState(color)}>{color}</button>
				))}
			</div>
			<div>
				<h1>B</h1>
				<Counter />
			</div>
		</div>
	)
}