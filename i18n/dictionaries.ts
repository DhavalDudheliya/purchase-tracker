/**
 * i18n dictionaries. Two languages:
 *  - en: proper English
 *  - gu: Gujlish (romanized Gujarati), keeping common English words that are
 *        used every day (Purchase, Rate, Total, Product, Resale, Supply).
 *
 * The Gujlish strings are a sensible first pass — easy to tweak here.
 * `en` is the source of truth for the shape; `gu` must match it (enforced by
 * the `Dictionary` type below).
 */

export const languages = ["en", "gu"] as const
export type Language = (typeof languages)[number]

/** Label shown on the toggle for the language you'll switch TO. */
export const otherLanguageLabel: Record<Language, string> = {
  en: "Gujlish",
  gu: "English",
}

const en = {
  appName: "Purchase Tracker",
  nav: {
    home: "Home",
    products: "Products",
    purchases: "Purchases",
  },
  common: {
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading…",
    somethingWrong: "Something went wrong. Please try again.",
  },
  home: {
    greeting: "Welcome back",
    tagline: "Log today's purchases in a few taps.",
    addPurchase: "Add Purchase",
    manageProducts: "Manage Products",
  },
  products: {
    title: "Products",
    add: "Add Product",
    editTitle: "Edit Product",
    addTitle: "New Product",
    empty: "No products yet. Add your first one.",
    name: "Name",
    namePlaceholder: "e.g. Cotton kurti",
    type: "Type",
    resale: "Resale",
    supply: "Supply",
    resaleHint: "Things you sell",
    supplyHint: "Packing / supplies",
    defaultPrice: "Default Rate",
    photo: "Photo",
    camera: "Camera",
    gallery: "Gallery",
    deleteConfirm: "Delete this product?",
    created: "Product added",
    updated: "Product updated",
    deleted: "Product deleted",
    deleteBlocked: "Can't delete — it has purchases logged.",
    nameRequired: "Please enter a name.",
  },
  purchases: {
    title: "Purchases",
    comingSoon: "Purchase logging is coming next.",
  },
}

export type Dictionary = typeof en

const gu: Dictionary = {
  appName: "Purchase Tracker",
  nav: {
    home: "Home",
    products: "Products",
    purchases: "Purchases",
  },
  common: {
    save: "Save karo",
    saving: "Save thay chhe…",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    loading: "Load thay chhe…",
    somethingWrong: "Kaik problem thayu. Fari try karo.",
  },
  home: {
    greeting: "Pacha aavya",
    tagline: "Aaj ni purchase thoda taps ma add karo.",
    addPurchase: "Purchase Add karo",
    manageProducts: "Products Manage karo",
  },
  products: {
    title: "Products",
    add: "Product Add karo",
    editTitle: "Product Edit karo",
    addTitle: "Navu Product",
    empty: "Haju koi product nathi. Pehlu add karo.",
    name: "Naam",
    namePlaceholder: "daakhla: Cotton kurti",
    type: "Type",
    resale: "Resale",
    supply: "Supply",
    resaleHint: "Je tame vecho cho",
    supplyHint: "Packing / supplies",
    defaultPrice: "Default Rate",
    photo: "Photo",
    camera: "Camera",
    gallery: "Gallery",
    deleteConfirm: "Aa product delete karvu chhe?",
    created: "Product add thayu",
    updated: "Product update thayu",
    deleted: "Product delete thayu",
    deleteBlocked: "Delete na thay — aana purchase logged chhe.",
    nameRequired: "Naam nakho.",
  },
  purchases: {
    title: "Purchases",
    comingSoon: "Purchase logging have thodi vaar ma aavse.",
  },
}

export const dictionaries: Record<Language, Dictionary> = { en, gu }
