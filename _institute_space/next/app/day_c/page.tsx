'use client'

import { entries } from "@lenix/lenix"
import { useState } from "react"

const colors = ['Red', 'Blue', 'Green', 'Black']
const sizes = {
	Small: 800,
	Medium: 1000,
	Large: 1100
}
const menus = ['Home', 'Products', 'Content']

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
	const [color, setColor] = useState(colors[0])
	const [size, setSize] = useState(entries(sizes)[0][0])
	const [expanded, setExpanded] = useState(false)
	
	return (
		<div>
			<div>
				<h1>A</h1>
				<p>the color is <span style={{ color: color.toLowerCase() }}>{color}</span></p>
				{colors.filter(color => color !== color).map(color => (
					<button key={color} onClick={() => setColor(color)}>{color}</button>
				))}
			</div>
			<div>
				<h1>B</h1>
				<Counter />
			</div>
			<div>
				<h1>C</h1>
				<div>
					<div>
						{entries(sizes).map(([size]) => (
							<button
								key={size}
								onClick={() => setSize(size)}
							>{size}</button>
						))}
					</div>
					<p>Current size: {size}</p>
					<p>Price: {sizes[size]}</p>
				</div>
			</div>
			<div>
				<h1>D</h1>
				<div>
					<button onClick={() => setExpanded(prev => !prev)}>{expanded ? 'ｘ Close' : 'Menu'}</button>
					<div className={`${expanded ? 'visible': 'invisible'} flex flex-col`}>
						{menus.map(menu => (
							<a href="#">{menu}</a>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}