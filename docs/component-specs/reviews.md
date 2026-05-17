# Reviews Component Spec

## Purpose

Define inline PDP reviews and full reviews overlay behavior.

## Reference Sources

- Inline reviews screenshot: `reference/fashionnova/pages/single-product/reviews-section/screenshot-mobile.png`
- Inline reviews DOM: `reference/fashionnova/pages/single-product/reviews-section/dom.mobile.cleaned.html`
- Reviews overlay screenshot: `reference/fashionnova/overlays/reviews/screenshot-mobile.png`
- Reviews overlay DOM: `reference/fashionnova/overlays/reviews/dom.mobile.cleaned.html`

## Visual Structure

- Inline section shows review cards/list, dates, reviewer name, title, fit metadata, body, helpful action, and load-more/see-all controls.
- Overlay is a tall mobile dialog, captured at 375x760, with scrollable review body.
- Stars use yellow token with neutral empty star color.

## Mobile Behavior

- Inline shows a limited number of reviews.
- `Load More` appends or reveals more.
- `See all reviews` opens overlay and traps focus.

## Desktop Behavior

- Inline section can expand into a wider list/grid below PDP details.
- Overlay can be centered modal or side panel.

## States

- No reviews, summary only, loading, loaded list, load more, helpful clicked, error.

## Data Dependencies

- Review provider/plugin not yet confirmed.
- WooCommerce native reviews if used: rating, author, date, content, verified owner, helpful count if available.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Do not invent review data.
- If WooCommerce native reviews lack helpful/fit metadata, hide those fields or map to available review meta.
- Keep review submission behavior out of scope unless later assigned.

## Accessibility Requirements

- Star ratings include accessible text.
- Review list uses list semantics.
- Load more is a button and announces added content.
- Overlay traps focus and closes with Escape.

## Acceptance Criteria

- Inline review density matches mobile reference.
- Overlay scrolls internally and does not scroll the page.
- Empty/no-review state is graceful.

## Open Risks

- Review system is not specified.
- Fashion Nova fit/helpful metadata may not exist in WooCommerce.
