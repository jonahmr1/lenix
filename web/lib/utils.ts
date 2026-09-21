export { cn } from 'cn'

export const CURRENT_USERNAME = 'jonahmr1'

export const compact = new Intl.NumberFormat('en', {
	notation: 'compact',
	maximumFractionDigits: 2,
})

export const anim = {
	initial: { opacity: 0, scale: 0.985 },
	whileInView: { opacity: 1, scale: 1 },
	transition: { duration: 1 }
}