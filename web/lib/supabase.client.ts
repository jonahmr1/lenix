import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./supabase";

export const createClient = () =>
	createBrowserClient(
		supabaseUrl!,
		supabaseKey!,
	);