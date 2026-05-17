# Notice Banners Component Spec

## Purpose

Define top-of-site promotional notices: countdown offer bar and secondary info slider/promo link.

## Reference Sources

- Countdown screenshots: `reference/fashionnova/banners/countdown/screenshot-mobile.png`, `reference/fashionnova/banners/countdown/screenshot-desktop.png`
- Countdown DOM: `reference/fashionnova/banners/countdown/dom.mobile.cleaned.html`, `reference/fashionnova/banners/countdown/dom.desktop.cleaned.html`
- Info slider screenshots: `reference/fashionnova/banners/info-slider/screenshot-mobile.png`, `reference/fashionnova/banners/info-slider/screenshot-desktop.png`
- Info slider DOM: `reference/fashionnova/banners/info-slider/dom.mobile.cleaned.html`, `reference/fashionnova/banners/info-slider/dom.desktop.cleaned.html`

## Visual Structure

- Countdown banner: full-width black or high-contrast promo surface, compact uppercase message, timer digits, and shop link.
- Info slider: full-width horizontal promo line with repeated text and call-to-action.
- Both use compact body-xs/body-2xs type and fixed heights from reference captures.

## Mobile Behavior

- Countdown is about 59px high in mobile capture.
- Info slider captured as about 90px high in context; implementation should maintain a compact promo area and avoid pushing header unpredictably.
- Text must wrap or scroll cleanly without overlapping digits or actions.

## Desktop Behavior

- Countdown is about 44px high.
- Info slider is about 72px high.
- Center content with full-bleed surface and no decorative card.

## States

- Active promo, no promo, countdown expired, link hover/focus, reduced-motion mode.

## Data Dependencies

- Admin-configurable promotion text, coupon code, target URL, and optional countdown end time.
- Currency and language should be localized for Moroccan market.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- WooCommerce coupon text can be displayed, but coupon behavior stays in WooCommerce/Smart Coupons.
- No AJAX required on page load; countdown may use lightweight vanilla JS if enabled.
- WP Rocket cache can serve static markup; countdown must tolerate cached pages.

## Accessibility Requirements

- Promo links are real links.
- Countdown updates must not spam screen readers; expose a concise static label.
- Provide visible focus states.
- Respect reduced motion for sliding text.

## Acceptance Criteria

- Mobile and desktop heights visually align with captures.
- Banner removal does not leave layout gaps.
- Promo copy is translatable and configurable.
- No Fashion Nova copy is hardcoded beyond reference notes.

## Open Risks

- Live promo content changes frequently; exact copy is not reusable.
- Countdown behavior needs product/marketing decision before final implementation.
