# Cart Page Spec

## Page Layout Order

1. Global banners/header.
2. Cart title and item count.
3. Empty or with-item cart body.
4. Coupon/promo area.
5. Recommendations.
6. Order summary and checkout action.

## Components Used

- `notice-banners`
- `navigation-header`
- `cart-components`
- `product-card`
- `account-overlays`

## Mobile Layout

- Single-column cart.
- With-item state shows free-shipping message, cart item card, coupon area, recommendations, and summary.
- Empty state shows message, sign-in prompt, start shopping/sign-in actions, and recommendations.

## Desktop Layout

- Empty state can center above recommendation grid.
- With-item state can split items and summary into columns if WooCommerce markup allows safely.

## Sticky Behavior

- Header sticky applies.
- Checkout action may be visually prominent but must not cover cart fields or totals.

## Empty States

- Empty cart message with start shopping and sign-in actions.
- Recommendations grid uses product-card component.

## Plugin Dependencies

- WooCommerce cart form, fragments, totals, coupons.
- Smart Coupons.
- Shipping Rate By Cities if cart shipping estimator is present.
- TI Wishlist if save-for-later is mapped to wishlist.

## Acceptance Criteria

- Empty and one-item cart match reference after visual approval.
- Quantity, remove, coupon, totals, and checkout navigation work.
- No payment/shipping/order logic changes.
