# PDP Info Section Component Spec

## Purpose

Define the product detail purchase panel: title, price, reviews, financing/promo copy, color links, size selection, add-to-cart, delivery/returns, product details, and similar styles.

## Reference Sources

- Desktop info screenshot: `reference/fashionnova/pages/single-product/info-section/screenshot-desktop.png`
- Desktop info DOM: `reference/fashionnova/pages/single-product/info-section/dom.desktop.cleaned.html`
- Single product full-page screenshots: `reference/fashionnova/pages/single-product/full-page/screenshot-mobile.png`, `reference/fashionnova/pages/single-product/full-page/screenshot-desktop.png`

## Visual Structure

- Sticky desktop side panel, max width about 370-393px, top offset tied to sticky header.
- Header includes small product title, sale/compare price, star rating and review count.
- Promo/payment row below price.
- Color label and linked color swatches.
- Size label with size guide trigger and grid of size buttons.
- Primary full-width Add to Bag button.
- Shipping/returns info and product details accordions below.
- Similar styles block uses small 2:3 images and a compact primary action.

## Mobile Behavior

- Mobile product info is inferred from full-page capture; stack below gallery.
- Size and add-to-cart controls must be thumb-friendly and remain visible enough before accordions.
- PDP sticky add-to-cart was not captured, so do not implement sticky bar until separately approved.

## Desktop Behavior

- Info panel sticks beside gallery using `position: sticky` and header-aware top offset.
- Add-to-cart stays within panel, not fixed to viewport.

## States

- Default, sale, regular price, color selected, size selected, size unavailable, size missing error, add-to-cart loading, out of stock, product details expanded, delivery updated.

## Data Dependencies

- WooCommerce product title, price, sale, stock, attributes, gallery, short/long description.
- SKU-prefix linked color products with cached group lookup.
- Reviews/rating source.
- Shipping messaging configured for Morocco/MAD.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- WooCommerce add-to-cart and variation forms must remain functional.
- No custom uncached SKU-prefix queries in product loops.
- Product details use WooCommerce product data, not Fashion Nova content.
- Payment provider widgets are not copied; MaChaussure payment copy must be decided separately.

## Accessibility Requirements

- Product title is the page `h1`.
- Price group has accessible text for sale and original price.
- Size group has `aria-label`, selected/unavailable states, and clear error on missing size.
- Add-to-cart loading/success/errors are announced.
- Accordions use `aria-expanded`.

## Acceptance Criteria

- Desktop side panel matches captured spacing, width, and sticky behavior after approval.
- Size selection and Add to Bag work with WooCommerce products.
- Linked color pills route to sibling product URLs and active state is visible.
- Mobile layout remains usable and does not depend on uncaptured sticky bar.

## Open Risks

- Info section was desktop-only captured.
- Payment/financing widgets from Fashion Nova are not reusable and likely not applicable.
- Delivery estimate logic must be MaChaussure-specific.
