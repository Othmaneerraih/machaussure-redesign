# Wishlist Page Spec

## Page Layout Order

1. Global banners/header.
2. Breadcrumb/back context if present.
3. Wishlist title and item count.
4. Empty or with-item wishlist content.
5. Recommendations/bestsellers.

## Components Used

- `notice-banners`
- `navigation-header`
- `wishlist-components`
- `product-card`
- `account-overlays`

## Mobile Layout

- Empty state stacks title, count, empty message, login/signup prompt, and product grid.
- With-item state follows manual DOM hierarchy with wishlist product card(s) and add-to-bag controls.

## Desktop Layout

- Wider product grid with title/count aligned to grid container.
- Account prompt remains compact.

## Sticky Behavior

- Header sticky applies.
- No wishlist-specific sticky controls.

## Empty States

- Empty wishlist message and login/signup prompt.
- Recommendations/bestsellers grid.

## Plugin Dependencies

- TI WooCommerce Wishlist for item storage, toggle state, and page rendering.
- WooCommerce product data and add-to-cart behavior.

## Acceptance Criteria

- Empty state matches live reference after approval.
- With-item state uses manual-only reference for guidance and is manually reviewed.
- Wishlist heart state remains synced between cards and page.
- Manual DOM is not copied into production.
