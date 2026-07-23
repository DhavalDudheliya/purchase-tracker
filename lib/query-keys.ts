/** Centralized TanStack Query keys so reads and invalidations stay in sync. */
export const queryKeys = {
  products: ["products"] as const,
  productStats: ["product-stats"] as const,
  purchases: ["purchases"] as const,
}
