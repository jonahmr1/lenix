import { asserts } from "@lenix/lenix";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
asserts(supabaseUrl && supabaseKey, 'Double check the env keys')

export const createAnon = () => createClient<Database>(supabaseUrl, supabaseKey)
