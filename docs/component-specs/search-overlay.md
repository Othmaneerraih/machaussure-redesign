# Search Overlay Component Spec

## Purpose

Create a mobile-first search overlay shell that visually follows Fashion Nova while delegating actual search indexing, history, analytics, and result retrieval to FiboSearch Pro.

## Reference Sources

- Manual idle DOM: `reference/fashionnova/_manual/overlays/search/dom-search-idle.mobile.manual.cleaned.html`
- Manual results DOM: `reference/fashionnova/_manual/overlays/search/dom-search-results.mobile.manual.cleaned.html`
- Search by image live screenshot: `reference/fashionnova/overlays/search-by-image/screenshot-mobile.png`
- Search by image DOM: `reference/fashionnova/overlays/search-by-image/dom.mobile.cleaned.html`
- Manual audit: `reference/fashionnova/_manual/SOURCE_AUDIT.md`

Manual search references are usable for visual/spec guidance only. They are not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Full-screen mobile search surface with top division tabs.
- Search input/header row below tabs.
- Idle content blocks: Recent, Hot Searches, Top Searches, Trending, Occasion, and optional carousel controls.
- Results content blocks: Categories, Popular terms, Pages, Products.
- Product result rows/cards should reuse product-card visual tokens at a compact scale.
- Search by image is a separate bottom dialog with title, upload/take-picture options, and example style prompts.

## Mobile Behavior

- Opens from header search trigger with body scroll lock.
- Focus moves to the search input.
- Idle state appears before query entry.
- Results state appears after query input and should debounce FiboSearch requests.
- Escape/back/close returns focus to the header search trigger.

## Desktop Behavior

- Desktop can use a constrained overlay/popover connected to header search if FiboSearch supports it.
- Maintain same content hierarchy, but results can use a wider two-column layout for suggestions and products.

## States

- Closed, opening, idle, query typing, loading, results, no results, error, image-search dialog, recent searches cleared.

## Data Dependencies

- FiboSearch Pro results API/index.
- FiboSearch analytics and search history where available.
- WooCommerce products, product categories, product images, prices, sale state, stock state.
- Optional curated hot/trending terms configured in WordPress.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Wrap FiboSearch Pro rather than replacing its engine.
- If FiboSearch cannot expose a needed UI piece, render MaChaussure shell and inject results from its public hooks/APIs.
- No new JS library; use vanilla JS and FiboSearch/WooCommerce events only where needed.
- Search by image is optional until a real provider or FiboSearch capability is confirmed.

## Accessibility Requirements

- Overlay uses `role="dialog"` with accessible label and focus trap.
- Input has a real label.
- Result groups use headings and list semantics.
- Loading and no-results messages use polite live regions.
- Recent search clear is a button with label.

## Acceptance Criteria

- At 390px, idle and result structures match manual reference hierarchy after manual review.
- Search input focus, Escape close, and body scroll lock work.
- FiboSearch result clicks route to product/category/page URLs.
- Manual DOM is not copied into production.

## Open Risks

- Search idle/results are manual-only and not screenshot-backed.
- FiboSearch Pro API/hook details must be confirmed on staging.
- Image search may be deferred.
