import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from './common'
import { Database } from './types'

export const createClient = () =>
	createBrowserClient<Database>(supabaseUrl!, supabaseKey!)
