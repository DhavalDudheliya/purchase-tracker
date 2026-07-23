"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductStats,
  listProducts,
  updateProduct,
} from "@/lib/supabase/products"
import type { ProductInsert, ProductUpdate } from "@/types/database"

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: listProducts,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...queryKeys.products, id],
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  })
}

export function useProductStats(id: string) {
  return useQuery({
    queryKey: [...queryKeys.productStats, id],
    queryFn: () => getProductStats(id),
    enabled: Boolean(id),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInsert) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductUpdate }) =>
      updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
    },
  })
}
