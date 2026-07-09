import type { ReactNode } from "react"

export interface Faq {
	question: string
	answer: string
}
export interface Route {
	path: string
	element: ReactNode
	label: string
}