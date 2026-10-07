import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./supabase";
import { Database } from "./supabase.types";

export const createClient = () =>
	createBrowserClient<Database>(
		supabaseUrl!,
		supabaseKey!,
	);