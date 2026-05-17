# Size Guide Overlay Component Spec

## Purpose

Provide the product size guide overlay/table for shoes, localized for MaChaussure customers.

## Reference Sources

- Live screenshot: `reference/fashionnova/pages/single-product/size-guide/screenshot-mobile.png`
- DOM: `reference/fashionnova/pages/single-product/size-guide/dom.mobile.cleaned.html`
- Metadata: `reference/fashionnova/pages/single-product/size-guide/metadata.json`

## Visual Structure

- Mobile bottom sheet/table surface, captured at 375x675.
- Header title, fit summary scale, table heading, and size conversion table.
- Table columns in reference include US/CAN, UK, EU, AUS; MaChaussure should prioritize EU/Morocco-relevant sizing.

## Mobile Behavior

- Opens from PDP size guide trigger.
- Scrolls internally if table exceeds viewport.
- Close returns focus to trigger.

## Desktop Behavior

- Centered modal or side sheet with max readable width.
- Table remains fully visible without horizontal clipping.

## States

- Closed, open, loading table, error/no table, size row highlighted if current size selected.

## Data Dependencies

- Product category/type.
- Size guide table content managed in theme/settings or product/category metadata.
- Current selected size if available.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Do not copy Fashion Nova table values unless independently valid for MaChaussure.
- Use local French labels and translatable strings.
- No template override required until PDP integration phase.

## Accessibility Requirements

- Dialog with label and focus trap.
- Table uses proper `table`, `thead`, `tbody`, `th`, and `td`.
- Fit scale has text labels, not color alone.
- Close and back controls are buttons.

## Acceptance Criteria

- At 390px, overlay height/density matches reference.
- Table is readable and scrollable without page scroll behind it.
- Trigger and close work by keyboard and touch.

## Open Risks

- Real MaChaussure size conversion data must be supplied.
- Fit summary/review-derived sizing depends on review platform data.
