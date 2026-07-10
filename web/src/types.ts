import type { ReactNode } from "react"

export interface Faq {
	question: string
	answer: string
}

export type Route = {
	path: string
	element: ReactNode
	label: string
} | {
	path: string
	element: ReactNode
	hidden: true
}

export interface FooterLink {
	link: string
	label: string
}

export interface Product {
	img: string
	title: string
	badges: string[]
	feature: string
	description: string
	price: number
	onClick: () => void
}
