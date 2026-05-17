# Wishlist Components Spec

## Purpose

Define wishlist empty and with-item page components using TI WooCommerce Wishlist.

## Reference Sources

- Empty wishlist screenshots: `reference/fashionnova/pages/wishlist/empty/screenshot-mobile.png`, `reference/fashionnova/pages/wishlist/empty/screenshot-desktop.png`
- Empty wishlist DOM: `reference/fashionnova/pages/wishlist/empty/dom.mobile.cleaned.html`, `reference/fashionnova/pages/wishlist/empty/dom.desktop.cleaned.html`
- Wishlist with item manual DOM: `reference/fashionnova/_manual/pages/wishlist/full-page/dom-wishlist-full.mobile.manual.cleaned.html`

Wishlist with item is manual-only, not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Page title: Wishlist with item count.
- Empty state: empty message, login/signup prompt, recommendation grid.
- With-item state: wishlist item card/grid, product image, title, price, add-to-bag/size controls, share optional, remove/wishlist toggle.

## Mobile Behavior

- Empty state content appears below site chrome and breadcrumb.
- With-item cards use product-card style with wishlist-specific actions.
- Login/signup opens account overlay.

## Desktop Behavior

- Wider recommendation/wishlist grid.
- Keep page title/count aligned with archive/card grid.

## States

- Empty, with items, logged out, logged in, item removed, add-to-cart loading, unavailable product.

## Data Dependencies

- TI WooCommerce Wishlist item list and item active states.
- WooCommerce product data for wishlist items.
- Account login state.
- Recommendations/bestsellers.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Use TI Wishlist hooks/templates/styling; do not edit plugin files.
- Heart toggle on product cards must stay synced with wishlist page.
- Add-to-bag from wishlist uses WooCommerce product forms/endpoints.

## Accessibility Requirements

- Wishlist count is text, not only icon.
- Remove/add controls are buttons with labels.
- Login/signup action opens accessible account overlay.
- Product cards maintain accessible names.

## Acceptance Criteria

- Empty state matches live reference.
- With-item state follows manual reference hierarchy and passes manual visual review.
- Wishlist toggles and page list stay in sync.

## Open Risks

- With-item reference is manual-only and from a different currency/locale state.
- TI Wishlist output shape must be inspected on staging.
