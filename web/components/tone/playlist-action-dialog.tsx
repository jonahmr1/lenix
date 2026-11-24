'use client'

import { useApp } from '@/app/tone/provider'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'

export function PlaylistActionDialog() {
	const { state, setState } = useApp()
	const { playlistId } = useParams<{ playlistId?: string }>()
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	return (
		<>
			<span hidden data-navigation-pending={pending} />
			<Dialog
				open={state.playlistAction !== null}
				onOpenChange={open => {
					if (!open && !state.playlistSaving)
						setState(previous => ({
							...previous,
							playlistAction: null,
						}))
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{state.playlistAction?.type === 'rename'
								? 'Rename playlist'
								: 'Delete playlist?'}
						</DialogTitle>
						{state.playlistAction?.type === 'delete' && (
							<DialogDescription>
								Delete{' '}
								<b className='font-black'>{state.playlistAction?.name}</b>? This
								cannot be undone
							</DialogDescription>
						)}
					</DialogHeader>
					<form
						noValidate
						className='grid gap-4'
						onSubmit={async event => {
							event.preventDefault()
							const action = state.playlistAction
							if (!action || state.playlistSaving) return
							const name = String(
								new FormData(event.currentTarget).get('name') ?? ''
							).trim()
							if (action.type === 'rename' && !name) {
								toast.error('Enter a playlist name.')
								return
							}
							setState(previous => ({
								...previous,
								playlistSaving: true,
							}))
							try {
								const supabase = createClient()
								const {
									data: { user },
									error: authError,
								} = await supabase.auth.getUser()
								if (authError || !user) throw new Error('Please sign in again.')
								const query =
									action.type === 'rename'
										? supabase.from('playlists').update({ label: name })
										: supabase.from('playlists').delete()
								const { data, error } = await query
									.eq('id', action.id)
									.eq('user_id', user.id)
									.select('id')
									.maybeSingle()
								if (error)
									throw new Error(
										`Couldn’t ${action.type} your playlist. Please try again.`
									)
								if (!data)
									throw new Error(
										'Playlist not found or you don’t have permission to change it. Refresh and try again.'
									)
							} catch (error) {
								toast.error(
									error instanceof Error
										? error.message
										: 'Something went wrong. Please try again.'
								)
								setState(previous => ({
									...previous,
									playlistSaving: false,
								}))
								return
							}
							startTransition(() => {
								if (action.type === 'delete' && playlistId === action.id)
									router.replace('/tone')
								setState(previous => ({
									...previous,
									playlists:
										action.type === 'rename'
											? previous.playlists.map(playlist =>
												playlist.id === action.id
													? { ...playlist, name }
													: playlist
											)
											: previous.playlists.filter(
												playlist => playlist.id !== action.id
											),
									playlistAction: null,
									playlistSaving: false,
								}))
							})
						}}
					>
						{state.playlistAction?.type === 'rename' && (
							<Field>
								<FieldLabel htmlFor='rename-playlist-name'>Name</FieldLabel>
								<Input
									disabled={state.playlistSaving}
									id='rename-playlist-name'
									name='name'
									defaultValue={state.playlistAction.name}
									autoComplete='off'
									required
									pattern='.*\S.*'
									className='text-base'
								/>
							</Field>
						)}
						<DialogFooter>
							<Button
								disabled={state.playlistSaving}
								className='w-full'
								type='submit'
								variant={
									state.playlistAction?.type === 'delete'
										? 'destructive'
										: 'default'
								}
							>
								{state.playlistSaving
									? state.playlistAction?.type === 'rename'
										? 'Saving…'
										: 'Deleting…'
									: state.playlistAction?.type === 'rename'
										? 'Save'
										: 'Delete'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}
