'use client'

import { useActionState } from 'react'
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import {
	InputGroup,
	InputGroupTextarea,
	InputGroupAddon,
	InputGroupButton,
} from '@/components/ui/input-group'
import { motion } from 'motion/react'
import { fade } from '@/lib/utils'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { sendMessage } from './actions'
import { toast } from 'sonner'
import { asserts } from '@lenix/lenix'
import { Layout } from '@/components/layout'

const Required = () => <span className='text-destructive'>*</span>

export default function Contact() {
	const [, action, pending] = useActionState(
		async (_previous: unknown, form: FormData) => {
			const request = sendMessage(form)

			toast.promise(async () => {
				const { error, message } = await request
				asserts(!error, message)
				
				return message
			}, {
				loading: "Sending...",
				success: message => message,
				error: message => message,
			})

			return request
		}, { error: false, message: 'unexpected' }
	)
	
	return (
		<Layout className='bg-background flex flex-col items-center'>
			<div className='flex flex-col justify-between w-2/3 portrait:w-full items-center'>
				<motion.div
					{...fade(0)}
					className='flex flex-col gap-10 h-full w-full justify-center flex-1'
				>
					<div>
						<p className='text-[11px] tracking-[3px] text-foreground/30 uppercase'>
							Get in touch
						</p>
						<h1 className='text-5xl font-semibold tracking-tight text-accent-foreground mt-0'>
							Contact
						</h1>
					</div>
					<form action={action}>
						<FieldSet>
							<FieldGroup>
								<FieldGroup className='flex flex-row'>
									<Field>
										<FieldLabel htmlFor='name' className='text-foreground/40'>
											Name <Required />
										</FieldLabel>
										<Input
											required
											id='name'
											name='name'
											autoComplete='off'
											placeholder='Lenix Dev'
											defaultValue='An Anonymous'
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor='email' className='text-foreground/40'>
											Email <Required />
										</FieldLabel>
										<Input
											required
											name='email'
											type='email'
											id='email'
											placeholder='contact@lenix.dev'
										/>
									</Field>
								</FieldGroup>
								<Field>
									<FieldLabel htmlFor='subject' className='text-foreground/40'>
										Subject <Required />
									</FieldLabel>
									<Input
										required
										name='subject'
										type='text'
										id='subject'
										placeholder='Interest'
										defaultValue='Unsubjected message'
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor='message' className='text-foreground/40'>
										Message <Required />
									</FieldLabel>
									<InputGroup>
										<InputGroupTextarea
											required
											id='message'
											name='message'
											placeholder='Write a message...'
										/>
										<InputGroupAddon
											align='block-end'
											className='justify-end'
										>
											<InputGroupButton
												type='submit'
												variant='default'
												size='sm'
												disabled={pending}
											>
												Send <ArrowRightIcon />
											</InputGroupButton>
										</InputGroupAddon>
									</InputGroup>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</motion.div>
			</div>
		</Layout>
	)
}
