import { useRef, useState, type SyntheticEvent } from 'react'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
	InputGroup,
	InputGroupTextarea,
	InputGroupAddon,
	InputGroupText,
	InputGroupButton,
} from '@/components/ui/input-group'
import { Required } from '@/components/required'
import { Spinner } from '@/components/ui/spinner'
import { ArrowRight, Check } from 'lucide-react'
import { Layout } from '@/components/layout'

export default () => {
	const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
		'idle',
	)
	const [value, setValue] = useState('')
	const abortRef = useRef<AbortController | null>(null)
	
	const handleCancel = () => abortRef.current?.abort()

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
		} catch (e) {
			setStatus(
				e instanceof DOMException && e.name === 'AbortError' ?
					'idle'
				:	'error',
			)
			console.error(e)
		} finally {
			setTimeout(() => {
				setStatus('idle')
			}, 3000)
		}
	}

	return (
		<Layout className='space-y-[5vh] py-[10vh] mx-[25vw]'>
			<div>
				<p className='text-[11px] tracking-[3px] text-foreground/30 uppercase mb-5'>
					Get in touch
				</p>
				<h1 className='text-5xl font-semibold tracking-tight text-foreground'>
					Contact us
				</h1>
			</div>
			<form
				onSubmit={event => handleSubmit(event)}
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
									placeholder='Lenix'
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
									placeholder='support@lenix.dev'
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
									placeholder='Write us a message...'
									onChange={event => setValue(event.target.value)}
								/>
								<InputGroupAddon
									align='block-end'
									className='justify-between'
								>
									<InputGroupText>{value.length}/1000</InputGroupText>
									{
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
												Sent <Check />
											</InputGroupButton>
										:	<InputGroupButton
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
		</Layout>
	)
}
