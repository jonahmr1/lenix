import type { Route } from "./+types/products.nav";
import { createClient } from "@/utils/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  const { data, error } = await supabase.from('products').select('id, name');
  if (error) return { products: [] };

  return { products: data.map(product => ({ id: product.id, title: product.name })) };
}