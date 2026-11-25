'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

export type Account = { name: string; email: string; avatar?: string }

export function AccountMenu({ account }: { account: Account }) {
  const router = useRouter()
  return (
    <SidebarFooter>
      <SidebarMenu className='not-typeset'>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size='lg' aria-label='Open account menu'>
                <Avatar>
                  <AvatarImage src={account.avatar} alt='' />
                  <AvatarFallback>
                    {account.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='truncate'>{account.name}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='top' align='start'>
              <DropdownMenuLabel className='break-all'>
                {account.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  try {
                    const { error } = await createClient().auth.signOut({
                      scope: 'local',
                    })
                    if (error) throw error
                    router.refresh()
                  } catch {
                    toast.error('Couldn’t sign out. Please try again.')
                  }
                }}
                variant='destructive'
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
