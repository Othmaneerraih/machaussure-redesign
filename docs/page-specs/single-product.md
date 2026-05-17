# Single Product Page Spec

## Page Layout Order

1. Countdown/info banners if active.
2. Global navigation header.
3. Product gallery.
4. Product info/purchase section.
5. Product details accordions.
6. Inline reviews section.
7. Related/similar products.
8. Size guide, reviews, and added-to-cart overlays as triggered.

## Components Used

- `notice-banners`
- `navigation-header`
- `pdp-gallery`
- `pdp-info-section`
- `size-guide-overlay`
- `reviews`
- `added-to-cart-overlay`
- `product-card`

## Mobile Layout

- Gallery appears first, full width, captured at 375x532.
- Product info stacks below gallery.
- Size selection and Add to Bag are prominent before secondary accordions.
- Sticky add-to-cart bar is not implemented from current references because live sticky bar was skipped.

## Desktop Layout

- Gallery and product info use two-column layout.
- Info panel sticks with header-aware top offset and about 370-393px max width.
- Similar styles can sit in the info panel or below main content based on prototype approval.

## Sticky Behavior

- Header sticky behavior applies.
- Desktop info panel is sticky.
- No mobile PDP sticky bar until a future captured/approved reference exists.

## Empty States

- Out of stock: replace Add to Bag with notify/restock or disabled state.
- Missing size: show accessible validation message.
- No reviews: show no-review state and hide unavailable metadata.

## Plugin Dependencies

- WooCommerce product/variation forms.
- TI Wishlist for heart controls.
- Advanced Woo Labels for badges.
- Review plugin or WooCommerce reviews.
- Custom cached SKU-prefix color linking.

## Acceptance Criteria

- PDP static prototype matches mobile and desktop full-page references after approval.
- Add to Bag works and opens added-to-cart overlay.
- Size guide opens, traps focus, and returns focus.
- Linked color pills are cached and route correctly.
