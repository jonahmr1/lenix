'use client'

import { motion } from "motion/react"

export const Reveal = ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof motion.div>) => (
	<motion.div
		initial={{ opacity: 0, y: 16 }}
		whileInView={{ opacity: 1, y: 0 }}
		transition={{ duration: 1 }}
		{...props}
	>
		{children}
	</motion.div>
)