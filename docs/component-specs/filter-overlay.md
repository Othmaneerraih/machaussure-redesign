# Filter Overlay Component Spec

## Purpose

Provide Fashion Nova-style mobile filter/sort drawer around FiboFilters Pro, with selected-filter state and archive result count.

## Reference Sources

- Filter open screenshot: `reference/fashionnova/pages/product-archive/filter-open/screenshot-mobile.png`
- Filter open DOM: `reference/fashionnova/pages/product-archive/filter-open/dom.mobile.cleaned.html`
- Filter selected screenshot: `reference/fashionnova/pages/product-archive/filter-selected/screenshot-mobile.png`
- Filter selected DOM: `reference/fashionnova/pages/product-archive/filter-selected/dom.mobile.cleaned.html`
- Manual fallback DOM: `reference/fashionnova/_manual/pages/product-archive/filter-selected/dom-filter-selected.mobile.manual.cleaned.html`

Use live selected reference first. Manual fallback is manual-only, not screenshot-backed, and must not be copied into production.

## Visual Structure

- Full mobile drawer with sticky 48px header, centered `Filter & Sort` title, close button at inline end.
- Scrollable accordion body with sections: Sort by, Size, Colors, Type, Heel Height, Heel Type, Width, Material, Print, Price.
- Mobile filter values render as 32px chip buttons with rounded 4px borders.
- Color values render as swatch plus label.
- Fixed bottom action bar with Clear and primary `See N results` button.

## Mobile Behavior

- Opens from sticky filter bar.
- Drawer covers viewport, locks body, and scrolls internally.
- Selecting a filter updates chip state and result count without closing.
- Apply closes drawer and refreshes product grid.
- Clear resets selected filters.

## Desktop Behavior

- Desktop can render filters inline/sidebar using FiboFilters native facets if visual match is acceptable.
- Preserve same section order and selected states.

## States

- Open, closed, section expanded/collapsed, option selected, option disabled/unavailable, loading results, no results, error, clear disabled.

## Data Dependencies

- FiboFilters Pro facets: sort, size, color, product type/category attributes, heel height/type, width, material, print, price.
- WooCommerce product attributes and category counts.
- Result count and current query URL.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Build custom overlay UI around FiboFilters Pro or restyle its mobile mode.
- Maintain cascading AND filtering.
- Avoid extra AJAX on page load; trigger only on user interaction.
- URL state should remain shareable when filters apply.

## Accessibility Requirements

- Drawer uses `role="dialog"` and focus trap.
- Accordions use `aria-expanded`.
- Filter chips use buttons or checkbox roles with `aria-checked`.
- Result count updates through polite live region.
- Clear/apply controls are real buttons.

## Acceptance Criteria

- At 390px, drawer header, chip density, scroll area, and fixed footer match live reference.
- Selected state visibly differs and is announced.
- FiboFilters Pro correctly narrows WooCommerce products.
- No uncached expensive queries are introduced.

## Open Risks

- FiboFilters Pro markup/API must be inspected on staging.
- Some Fashion Nova facets may not exist in MaChaussure product data.
