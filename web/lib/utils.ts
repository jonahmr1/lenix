export { cn } from "cn"

export const fade = (delay = 0) => ({
	initial: { opacity: 0, y: 16 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.5, delay },
})

export const CURRENT_USERNAME = 'jonahmr1'
