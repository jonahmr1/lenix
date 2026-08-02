'use client'
import { useState, useEffect } from 'react'
import { TextEffect } from '../ui/flip'
import { QUOTES } from '@/constants'
import { motion } from 'motion/react'
import { fade } from '@/lib/utils'

const randomNewNumber = (lastNumber: number | null, length: number): number => {
	const n = Math.floor(Math.random() * length)
	return n === lastNumber ? randomNewNumber(lastNumber, length) : n
}

const blurSlideVariants = {
	container: {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.01 } },
		exit: { transition: { staggerChildren: 0.01, staggerDirection: 1 } },
	},
	item: {
		hidden: { opacity: 0, filter: 'blur(10px) brightness(0%)', y: 0 },
		visible: {
			opacity: 1,
			y: 30,
			filter: 'blur(0px) brightness(100%)',
			transition: { duration: 1 },
		},
		exit: {
			opacity: 0,
			y: -30,
			filter: 'blur(10px) brightness(0%)',
			transition: { duration: 1 },
		},
	},
}

export const Quotes = () => {
	const [trigger, setTrigger] = useState(true)
	const [quoteIndex, setQuoteIndex] = useState(() =>
		randomNewNumber(null, QUOTES.length),
	)
	const [completedTriggers, setCompletedTriggers] = useState(0)

	useEffect(() => {
		const delay = 5000
		const interval = setInterval(() => {
			setTrigger(prev => !prev)
		}, delay)
		return () => {
			clearInterval(interval)
		}
	}, [])

	const triggerCompleted = () => {
		const mod = 2
		if (completedTriggers % mod === 1)
			setQuoteIndex(randomNewNumber(quoteIndex, QUOTES.length))
		setCompletedTriggers(prev => prev + 1)
	}

	return (
		<motion.div {...fade(0)} className='flex flex-col gap-2'>
			<div className='h-10'>
				<TextEffect
					className='text-ring italic font-light text-center'
					style={{
						fontSize: 'var(--font-size-fluid-sm)',
						wordBreak: 'break-word',
						whiteSpace: 'normal',
					}}
					per='char'
					variants={blurSlideVariants}
					trigger={trigger}
					speedSegment={0.2}
					onAnimationComplete={triggerCompleted}
				>
					{QUOTES[quoteIndex]}
				</TextEffect>
			</div>
		</motion.div>
	)
}
