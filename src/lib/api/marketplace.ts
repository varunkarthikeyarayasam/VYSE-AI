import { supabase } from "../supabase";
import type { MarketplaceItem } from "../../types/database";

export async function getMarketplaceItems(category?: string): Promise<MarketplaceItem[]> {
  let query = supabase
    .from("marketplace_items")
    .select(`
      *,
      profiles (full_name, email)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((item: any) => ({
    ...item,
    seller: item.profiles,
  })) as MarketplaceItem[];
}

export async function createMarketplaceItem(item: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
}): Promise<MarketplaceItem> {
  const { data, error } = await supabase
    .from("marketplace_items")
    .insert({
      seller_id: item.sellerId,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      status: "available",
    })
    .select()
    .single();

  if (error) throw error;
  return data as MarketplaceItem;
}