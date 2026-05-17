# Cart Components Spec

## Purpose

Define cart page components for empty and with-item states while preserving WooCommerce cart form behavior.

## Reference Sources

- Empty cart screenshots: `reference/fashionnova/pages/cart/empty/screenshot-mobile.png`, `reference/fashionnova/pages/cart/empty/screenshot-desktop.png`
- Empty cart DOM: `reference/fashionnova/pages/cart/empty/dom.mobile.cleaned.html`, `reference/fashionnova/pages/cart/empty/dom.desktop.cleaned.html`
- Cart with item screenshot: `reference/fashionnova/pages/cart/full-page/screenshot-mobile.png`
- Cart with item DOM: `reference/fashionnova/pages/cart/full-page/dom.mobile.cleaned.html`

## Visual Structure

- Header/site chrome remains consistent.
- Empty state: `My Bag`, empty message, sign-in prompt, start shopping/sign-in actions, recommendation grid.
- With-item state: item count, share optional, free shipping progress/message, sign-in sync prompt, item row/card, promo/coupon area, recommendations, order summary totals, checkout action.

## Mobile Behavior

- Cart item row stacks image/details/actions cleanly.
- Totals and checkout action remain prominent near bottom of cart content.
- Recommendation products use product-card compact grid.

## Desktop Behavior

- Desktop can split cart items and order summary into two columns.
- Empty state centers message and uses wider recommendation grid.

## States

- Empty, with items, quantity updating, item removed, coupon applied/error, save for later, loading totals, checkout disabled.

## Data Dependencies

- WooCommerce cart items, quantities, prices, coupons, shipping/tax estimates, totals.
- TI Wishlist if save-for-later maps to wishlist.
- Recommendation products.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Preserve WooCommerce cart form fields, nonces, quantity updates, coupon hooks, shipping/tax hooks.
- Do not modify payment or shipping logic.
- Smart Coupons must remain functional.

## Accessibility Requirements

- Cart item controls have labels.
- Quantity controls are accessible inputs/buttons.
- Coupon input has label and status messages.
- Totals are readable as structured summary.

## Acceptance Criteria

- Empty and with-item cart states match references after approval.
- Cart quantity, remove, coupon, and checkout route work on staging.
- No JavaScript breaks WooCommerce cart fragments or totals.

## Open Risks

- Save for later depends on wishlist plugin behavior.
- Desktop with-item cart was not live captured.
