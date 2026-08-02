import { HEADER, HOBIES } from '@/constants'
import { motion } from 'motion/react'
import { TypingAnimation } from '../ui/typing'
import RotatingText from '../ui/swap'
import { fade } from '@/lib/utils'

export const Introduc = () => (
	<div className='w-full flex flex-col justify-center gap-2'>
		<motion.div {...fade(0)} className='relative px-4 uppercase mb-5'>
			<div className='invisible'>
				{HEADER.reduce((acc, itr) => (acc.length > itr.length ? acc : itr))}
			</div>
			<TypingAnimation
				as='div'
				words={HEADER}
				cursorStyle='line'
				typeSpeed={50}
				loop
				deleteSpeed={10}
				className='absolute inset-0 text-sm text-foreground/30 leading-relaxed tracking-[3px]'
			/>
		</motion.div>
		<motion.h1
			{...fade(0.25)}
			className='text-5xl font-semibold tracking-tight text-foreground mb-3'
		>
			Lenix
		</motion.h1>
		<motion.div {...fade(0.5)} className='text-foreground/30'>
			<span>Self-taught computer scientist who loves </span>
			<RotatingText
				texts={HOBIES}
				mainClassName='inline-flex flex-wrap whitespace-normal align-baseline'
			/>
		</motion.div>
	</div>
)
