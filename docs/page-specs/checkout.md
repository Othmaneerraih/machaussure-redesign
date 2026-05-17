# Checkout Page Spec

## Page Layout Order

1. Checkout page shell.
2. Order summary.
3. Contact/login section.
4. Delivery/address fields.
5. Shipping methods.
6. Payment methods.
7. Billing/coupon/order notes if present.
8. Totals and place-order action.

## Components Used

- `checkout-components`
- WooCommerce native checkout fields and hooks.

## Mobile Layout

- Single-column form with compact sections.
- Order summary can collapse only if existing WooCommerce/plugin markup safely supports it.
- Place order remains in native WooCommerce checkout form.

## Desktop Layout

- CSS-only two-column layout if safe: form content on inline start and summary on inline end.
- No template override.

## Sticky Behavior

- Optional sticky order summary only if CSS-only and no overlap with fields or payment methods.
- Header/global sticky should not block checkout field focus.

## Empty States

- If cart is empty, WooCommerce default empty-checkout/cart redirect behavior remains intact.
- Validation errors remain field-level and summary-level as WooCommerce outputs them.

## Plugin Dependencies

- WooCommerce checkout.
- WooCommerce CMI Gateway.
- Shipping Rate By Cities.
- Smart Coupons.
- Sequential Order Numbers.

## Acceptance Criteria

- CSS-only restyle, no template override.
- All checkout fields, nonces, payment hooks, shipping hooks, coupon hooks, and validation remain functional.
- Checkout changes receive REVIEW session, manual staging test order, and rollback branch/tag before merge.
- Manual Fashion Nova checkout reference is not copied.
