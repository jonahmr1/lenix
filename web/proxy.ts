import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase.middleware'

export async function proxy(request: NextRequest) {
  return createClient(request)
}

export const config = {
  matcher: ['/tone/:path*'],
}
