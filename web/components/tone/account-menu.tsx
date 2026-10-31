'use client'
import { UserCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AuthControls } from './auth-controls'

export function AccountMenu({
  email,
  name,
  avatarUrl,
}: {
  email: string | null
  name: string | null
  avatarUrl: string | null
}) {
  const initials = name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()
    : email?.[0]?.toUpperCase()
  const accountAvatar = (
    <Avatar>
      <AvatarImage src={avatarUrl ?? undefined} alt="" />
      <AvatarFallback>
        {initials || <UserCircleIcon aria-hidden="true" className="size-5" />}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="size-11"
          aria-label="Open account menu"
        >
          {accountAvatar}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="not-typeset p-4"
        aria-label="Your account"
      >
        <div className="flex items-center gap-3">
          {accountAvatar}
          <PopoverHeader className="min-w-0">
            <PopoverTitle className="break-words">
              {name ?? 'Your account'}
            </PopoverTitle>
            <PopoverDescription className="break-all">
              {email ?? 'Signed in with Google'}
            </PopoverDescription>
          </PopoverHeader>
        </div>
        <AuthControls account={{ email }} initialMessage={null} compact />
      </PopoverContent>
    </Popover>
  )
}
