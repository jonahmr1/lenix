'use client'

import { anim } from "@/lib/utils"
import { motion } from "motion/react"

export const Reveal = ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof motion.div>) => (
	<motion.div
		{...anim}
		{...props}
	>
		{children}
	</motion.div>
)