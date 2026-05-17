# Product Archive Controls Component Spec

## Purpose

Define archive-level controls: category strip, sticky filter bar, sort/filter triggers, count display, and selected-filter summary.

## Reference Sources

- Full archive screenshots: `reference/fashionnova/pages/product-archive/full-page/screenshot-mobile.png`, `reference/fashionnova/pages/product-archive/full-page/screenshot-desktop.png`
- Sticky filter bar screenshot: `reference/fashionnova/pages/product-archive/sticky-filter-bar/screenshot-mobile.png`
- Sticky filter DOM: `reference/fashionnova/pages/product-archive/sticky-filter-bar/dom.mobile.cleaned.html`
- Category strip manual DOM: `reference/fashionnova/_manual/pages/product-archive/category-strip/dom-category-strip.mobile.manual.cleaned.html`

Category strip reference is manual-only, not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Category strip: horizontal category chips/links above archive grid, with collection title/count context.
- Sticky filter bar: 343x44 mobile pill/row with Sort, Colors, Size, Filter.
- Controls use compact uppercase/body-xs style, neutral borders, and white background.
- Selected filters should appear as removable chips near controls when needed.

## Mobile Behavior

- Category strip scrolls horizontally.
- Sticky filter bar sticks below header once archive grid scrolls.
- Tapping Sort/Colors/Size/Filter opens the filter overlay to the relevant section.

## Desktop Behavior

- Category strip can become a horizontal nav or compact row.
- Filtering may be inline/sidebar or top controls depending FiboFilters behavior.
- Sticky mobile bar is hidden or replaced by desktop filter controls.

## States

- No filters, filters selected, sort selected, loading, no results, category active, sticky active.

## Data Dependencies

- WooCommerce category hierarchy and product counts.
- FiboFilters Pro current facets and selected state.
- Current archive query/sort.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Category strip links use WooCommerce category URLs.
- Sort/filter state must remain in URL or FiboFilters state.
- Avoid duplicate controls that conflict with FiboFilters.

## Accessibility Requirements

- Category strip has a nav label.
- Filter/sort triggers are buttons with `aria-expanded`.
- Selected filter chips include remove buttons with labels.
- Sticky bar does not cover focused elements.

## Acceptance Criteria

- At 390px, sticky bar size and labels match reference.
- Category strip follows manual reference structure and is clearly marked for visual review.
- Filter triggers open correct overlay sections.
- Archive remains usable without JavaScript through normal links/forms where feasible.

## Open Risks

- Category strip has no screenshot-backed reference.
- Desktop archive controls need FiboFilters staging inspection.
