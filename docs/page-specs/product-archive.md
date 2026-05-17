# Product Archive Page Spec

## Page Layout Order

1. Countdown/info banners if active.
2. Global navigation header.
3. Archive title/count and manual-reference category strip.
4. Sticky mobile filter bar.
5. Product grid using product-card component.
6. Pagination/load more if configured.
7. Footer/menu content as global site chrome.

## Components Used

- `notice-banners`
- `navigation-header`
- `product-archive-controls`
- `filter-overlay`
- `product-card`

## Mobile Layout

- 390px baseline with 16px gutters.
- Category strip scrolls horizontally.
- Product grid is two columns; product card captured at 187x363.
- Sticky filter bar is 343x44 and opens filter overlay sections.

## Desktop Layout

- Header becomes desktop mode at header breakpoint.
- Product grid expands according to available width, aiming for reference card width around 282px at 1440px.
- Category strip and filters can become inline controls/sidebar after FiboFilters staging review.

## Sticky Behavior

- Header remains sticky/scroll-aware.
- Mobile filter bar sticks below header without covering products.
- Filter drawer body locks page scroll and scrolls internally.

## Empty States

- No products: show clear message, clear filters action, and optionally category recommendations.
- No filtered results: keep filter overlay accessible and expose clear filters.

## Plugin Dependencies

- WooCommerce product archive loop.
- FiboFilters Pro for facets and cascading AND filtering.
- FiboSearch Pro only if archive search facet is used.
- TI Wishlist for product-card heart state.
- Advanced Woo Labels for sale/badge if available.

## Acceptance Criteria

- Static prototype for product card/archive is visually approved before WooCommerce integration.
- Archive matches live reference at 390px and 1440px after approval.
- Filters update products and URL/state correctly.
- No uncached SKU-prefix color queries run in product loops.
