'use client'

import Form from 'next/form'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

function SearchButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      variant="ghost"
      className="absolute top-0 right-0 size-11"
      disabled={pending}
      aria-label="Search YouTube"
    >
      {pending ? <Spinner /> : <MagnifyingGlassIcon aria-hidden="true" />}
    </Button>
  )
}

export function TrackSearchForm() {
  const query = useSearchParams().get('q') ?? ''
  return (
    <div className='w-full flex justify-center'>
				<Form
				action="/tone/search"
				prefetch={false}
				className="relative w-1/2"
				role="search"
			>
				<Input
					key={query}
					defaultValue={query}
					type="search"
					name="q"
					required
					maxLength={200}
					aria-label="Search tracks"
					placeholder="Search YouTube tracks"
					className="h-11 pr-12 text-base"
				/>
				<SearchButton />
			</Form>
		</div>
  )
}
