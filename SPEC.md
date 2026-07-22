# Purchase Tracker — Final Spec (v1)

## Problem
An online seller (Amazon/Flipkart/Meesho) in Surat, Gujarat buys inventory and
packing supplies from local wholesalers almost daily. Today it's tracked on paper
or from memory — prices get forgotten, notes get lost, and month-end accounting is
a headache. This app lets the seller log every purchase on their phone the moment
it happens, building an accurate, searchable history.

## Who
- **Single user.** No login, no accounts, no sub-users, no permissions — now or later.

## Core concepts

### 1. Products (catalog — added once)
- Name
- **Type: Resale or Supply** (Resale = things you sell; Supply = boxes, tape, labels, etc.)
- **Default price** (usual rate — used to pre-fill purchases)
- **Image (optional)** — uploaded from camera or gallery; shown in the product
  picker and history to make products easy to recognize at a glance.

### 2. Purchases (logged every time)
- Date (defaults to today, editable)
- Product (picked from catalog)
- Quantity (plain number, no units)
- Rate (pre-filled from product's default price, **editable per purchase**)
- Total (auto-calculated = Quantity × Rate)
- One purchase = one product.

## Rules
- The rate is stored **on each purchase**, so the same product bought at different
  places/rates is just multiple entries with different rates.
- Editing a purchase's rate does **not** change the product's default price
  (the default is set manually by the user).
- No shop/wholesaler name. No udhaar/credit tracking. No units. No offline mode.
- Product type (Resale/Supply) is set on the product; the purchase picker has
  **Resale | Supply** tabs for fast selection.

## What the app shows
- Log a purchase in a few taps.
- Purchase history (filter/search by product, date, type).
- Per-product insights: last rate, average/lowest/highest rate, total qty & money spent.
- Resale vs Supply totals kept separate (for easy accounting later).

## Language
- **Two-language toggle:**
  - **Gujlish** — romanized Gujarati, using common English words where they're the
    everyday term (e.g. "Purchase", "Rate", "Total" stay as-is; other labels in Gujlish).
  - **Proper English.**

## Platform
- **Mobile-first web app**, works in the phone browser. Online (needs internet).

## Explicitly out of scope (future phases)
- Sales/revenue and profit tracking
- Udhaar / supplier balances
- Offline mode
- Multi-user
