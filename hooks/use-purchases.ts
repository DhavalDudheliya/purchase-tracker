"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import {
  createPurchase,
  deletePurchase,
  listPurchases,
  updatePurchase,
} from "@/lib/supabase/purchases"
import type { PurchaseInsert, PurchaseUpdate } from "@/types/database"

/** Invalidate everything that depends on purchase data. */
function useInvalidatePurchases() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.purchases })
    queryClient.invalidateQueries({ queryKey: queryKeys.productStats })
  }
}

export function usePurchases() {
  return useQuery({
    queryKey: queryKeys.purchases,
    queryFn: listPurchases,
  })
}

export function useCreatePurchase() {
  const invalidate = useInvalidatePurchases()
  return useMutation({
    mutationFn: (input: PurchaseInsert) => createPurchase(input),
    onSuccess: invalidate,
  })
}

export function useUpdatePurchase() {
  const invalidate = useInvalidatePurchases()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PurchaseUpdate }) =>
      updatePurchase(id, input),
    onSuccess: invalidate,
  })
}

export function useDeletePurchase() {
  const invalidate = useInvalidatePurchases()
  return useMutation({
    mutationFn: (id: string) => deletePurchase(id),
    onSuccess: invalidate,
  })
}
