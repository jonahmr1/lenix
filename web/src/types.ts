import type { ReactNode } from "react"

export interface Faq {
	question: string
	answer: string | ReactNode
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
	title: string | ReactNode
	badges: string[]
	feature: string
	description: string
	price: number
	docs: string
	requirements: string[]
	accordion: Faq[]
}

export type Products = Record<string, Product>
