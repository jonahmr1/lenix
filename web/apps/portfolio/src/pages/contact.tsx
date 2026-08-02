import { useRef, useState, type SyntheticEvent } from 'react'
import { fade } from '@/lib/utils'
import { Footer } from '@/components/articles/footer'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { Switch } from '@workspace/ui/components/switch'
import {
	InputGroup,
	InputGroupTextarea,
	InputGroupAddon,
	InputGroupText,
	InputGroupButton,
} from '@workspace/ui/components/input-group'
import { Required } from '@/components/required'
import { Spinner } from '@workspace/ui/components/spinner'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'motion/react'

// eslint-disable-next-line max-lines-per-function
export const Contact = () => {
	const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
		'idle',
	)
	const [value, setValue] = useState('')
	const abortRef = useRef<AbortController | null>(null)

	const handleCancel = () => {
		abortRef.current?.abort()
	}

	const handleSubmit = async (
		event: Readonly<SyntheticEvent<HTMLFormElement>>,
	) => {
		abortRef.current = new AbortController()
		event.preventDefault()
		setStatus('loading')
		const body = new FormData(event.currentTarget)
		try {
			const res = await fetch('/api/send', {
				method: 'POST',
				body,
				signal: abortRef.current.signal,
			})
			setStatus(res.ok ? 'done' : 'error')
		} catch (err) {
			setStatus(
				err instanceof DOMException && err.name === 'AbortError' ?
					'idle'
					: 'error',
			)
		} finally {
			setTimeout(() => {
				setStatus('idle')
			}, 3000)
		}
	}

	return (
		<div className='bg-background flex flex-col items-center'>
			<div className='min-h-screen flex flex-col justify-between min-w-2/5 portrait:min-w-9/10 items-center'>
				<motion.div
					{...fade(0)}
					className='flex flex-col gap-10 h-full w-full justify-center py-16 flex-1'
				>
					<div>
						<p className='text-[11px] tracking-[3px] text-foreground/30 uppercase mb-5'>
							Get in touch
						</p>
						<h1 className='text-5xl font-semibold tracking-tight text-foreground'>
							Contact
						</h1>
					</div>
					<form
						onSubmit={event => {
							handleSubmit(event)
						}}
					>
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
											value={value}
											required
											id='message'
											name='message'
											placeholder='Write a message...'
											onChange={event => {
												setValue(event.target.value)
											}}
										/>
										<InputGroupAddon
											align='block-end'
											className='justify-between'
										>
											<InputGroupText>{value.length}/1000</InputGroupText>
											{
												// eslint-disable-next-line no-nested-ternary
												status === 'idle' ?
													<InputGroupButton
														aria-invalid={value.length > 1000}
														disabled={value.length > 1000}
														type='submit'
														variant='default'
														size='sm'
													>
														Send <ArrowRight />
													</InputGroupButton>
													// eslint-disable-next-line no-nested-ternary
													: status === 'loading' ?
														<InputGroupButton
															type='button'
															variant='default'
															size='sm'
															onClick={handleCancel}
															className='group'
														>
															<span className='group-hover:hidden flex items-center gap-1'>
																Sending... <Spinner />
															</span>
															<span className='hidden group-hover:inline'>
																Cancel
															</span>
														</InputGroupButton>
														: status === 'done' ?
															<InputGroupButton
																disabled
																type='button'
																variant='default'
																size='sm'
															>
																Sent <CheckCircle />
															</InputGroupButton>
															: <InputGroupButton
																disabled
																type='button'
																variant='default'
																size='sm'
															>
																Failed
															</InputGroupButton>

											}
										</InputGroupAddon>
									</InputGroup>
								</Field>
								<Field>
									<FieldLabel htmlFor='files' className='text-foreground/40'>
										Files
									</FieldLabel>
									<Input id='files' name='files' type='file' multiple />
									<FieldDescription>Select files to upload.</FieldDescription>
								</Field>
								<Field orientation='horizontal'>
									<Switch name='subscribe' id='subscribe' />
									<FieldLabel
										htmlFor='subscribe'
										className='text-foreground/40'
									>
										Subscribe to the newsletter
									</FieldLabel>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</motion.div>
				<div className='w-full'>
					<Footer items={
						[
							{ label: 'GitHub', url: 'https://github.com/jonahmr1' },
							{
								label: 'Home',
								url: '/',
								replace: true,
							},
						]
					} />
				</div>
			</div>
		</div>
	)
}
