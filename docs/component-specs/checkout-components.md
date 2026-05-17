# Checkout Components Spec

## Purpose

Restyle WooCommerce checkout with Fashion Nova-inspired visual hierarchy while preserving all checkout fields, nonces, payment hooks, shipping hooks, and validation.

## Reference Sources

- Manual checkout DOM: `reference/fashionnova/_manual/pages/checkout/full-page/dom-checkout-full.mobile.manual.cleaned.html`
- Manual audit: `reference/fashionnova/_manual/SOURCE_AUDIT.md`
- Decision: checkout CSS-only restyle in `DECISIONS.md`

Checkout reference is manual-only, not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Mobile-first checkout with order summary, express/alternative checkout area if applicable, contact, delivery/address, shipping, payment, billing, and totals.
- Inputs should use compact white fields, neutral borders, visible focus, and clear section headings.
- Order summary should stay readable and separated from form sections.

## Mobile Behavior

- Single-column checkout.
- Order summary may collapse/expand if WooCommerce layout supports it.
- Primary place-order action remains in WooCommerce checkout flow.

## Desktop Behavior

- CSS-only two-column visual structure if achievable without template override.
- Order summary may sit inline-end/sticky only if existing markup permits safe CSS.

## States

- Empty/invalid checkout, shipping address changing, payment method selected, coupon applied/error, processing order, validation errors.

## Data Dependencies

- WooCommerce checkout fields, cart totals, shipping methods, payment methods.
- WooCommerce CMI Gateway.
- Shipping Rate By Cities.
- Smart Coupons.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- CSS-only restyle. No template override.
- Preserve all WooCommerce hooks and gateway markup.
- Checkout changes require a REVIEW session before merge, manual staging test order, and rollback branch/tag.

## Accessibility Requirements

- Do not hide labels or required indicators.
- Error messages must stay connected to fields.
- Payment method radio controls remain accessible.
- Place order button remains a real submit button.

## Acceptance Criteria

- Checkout CSS restyle keeps all fields and plugins functional.
- Manual test order passes on staging before merge.
- No payment/shipping/order logic is modified.
- Manual reference is used for hierarchy only, not copied.

## Open Risks

- Fashion Nova checkout is Shopify-like and may not map cleanly to WooCommerce markup.
- No screenshot-backed checkout reference exists.
- Highest regression risk; requires separate review session.
