import type {
  Product,
  Purchase,
  PurchaseInsert,
  PurchaseUpdate,
} from "@/types/database"

import { supabase } from "./client"

/** A purchase joined with the essentials of its product, for display. */
export type PurchaseWithProduct = Purchase & {
  product: Pick<Product, "id" | "name" | "type" | "image_url"> | null
}

const SELECT = "*, product:products(id, name, type, image_url)"

export async function listPurchases(): Promise<PurchaseWithProduct[]> {
  const { data, error } = await supabase
    .from("purchases")
    .select(SELECT)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) throw error
  // The hand-maintained DB types don't model the embedded relation, so cast
  // the known shape of this specific select.
  return (data ?? []) as unknown as PurchaseWithProduct[]
}

export async function createPurchase(input: PurchaseInsert): Promise<void> {
  const { error } = await supabase.from("purchases").insert(input)
  if (error) throw error
}

export async function updatePurchase(
  id: string,
  input: PurchaseUpdate,
): Promise<void> {
  const { error } = await supabase.from("purchases").update(input).eq("id", id)
  if (error) throw error
}

export async function deletePurchase(id: string): Promise<void> {
  const { error } = await supabase.from("purchases").delete().eq("id", id)
  if (error) throw error
}
