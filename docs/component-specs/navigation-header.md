# Navigation Header Component Spec

## Purpose

Provide the global MaChaussure header for mobile and desktop: promo-aware sticky top navigation, logo, division/category tabs, search entry, account, wishlist, cart, and mobile menu trigger.

## Reference Sources

- Live: `reference/fashionnova/navigation/header/screenshot-mobile.png`
- Live: `reference/fashionnova/navigation/header/screenshot-desktop.png`
- DOM: `reference/fashionnova/navigation/header/dom.mobile.cleaned.html`
- DOM: `reference/fashionnova/navigation/header/dom.desktop.cleaned.html`
- Tokens: `reference/fashionnova/_global/fashionnova.raw.css`

## Visual Structure

- White header surface with compact black logo and icon controls.
- Mobile order: logo/icon row, icon nav, horizontal division/category row, full-width rounded search bar.
- Desktop order: logo, primary division tabs, wide search bar, country/account/wishlist/cart icons, category nav.
- Search field uses 44px height, 26px radius, 2px neutral border, search icon at inline start and image-search trigger at inline end.
- Category tabs are uppercase body-xs-bold style with horizontal overflow and active/hover underline or soft pill treatment.

## Mobile Behavior

- Header stacks to about 141px captured height below the countdown banner.
- Category links scroll horizontally without visible scrollbars.
- Search opens the custom search overlay shell.
- Menu button opens the menu overlay; account opens sign-in overlay; wishlist/cart link to their pages or drawers as configured.

## Desktop Behavior

- Header compresses to about 96px captured height below the countdown banner.
- Division tabs and account actions stay in the top row.
- Category nav remains horizontally available with hover states.
- Search bar is constrained to the header search max width and opens FiboSearch-backed overlay/results.

## States

- Default, sticky, scroll-down/scroll-up, active division, active category, cart count > 0, wishlist count > 0, search focused, menu open, account overlay open.
- Loading state for search suggestions should be inside search overlay, not in the header bar.

## Data Dependencies

- WordPress menu locations for division/category links.
- WooCommerce cart count.
- TI Wishlist item count/status.
- Site locale/currency display for Morocco/MAD.
- FiboSearch Pro for search activation and results.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- WooCommerce: read cart count through fragments or server-rendered count; do not change cart logic.
- FiboSearch: header search acts as a trigger and visual shell around FiboSearch Pro.
- TI Wishlist: heart/wishlist icon links to wishlist page and displays count if plugin exposes one.
- GeneratePress: implement in child theme hooks/templates only.

## Accessibility Requirements

- Use landmark `<header>` and real `<nav>` regions with labels.
- Icon-only controls need accessible labels.
- Search trigger must be keyboard focusable and set `aria-expanded`.
- Horizontal tab lists must remain keyboard reachable.
- Visible focus ring on all links/buttons.
- Directional controls must use `.fn-icon--rtl-flip`.

## Acceptance Criteria

- At 390px, header order, search shape, icon scale, tab overflow, and total height match the mobile reference after visual approval.
- At 1440px, header row structure, search width, and category placement match desktop reference after visual approval.
- Cart/wishlist/account/search/menu actions work with keyboard and touch.
- No physical directional CSS in production.

## Open Risks

- Fashion Nova logo assets cannot be used; MaChaussure needs its own logo treatment sized to the same visual slot.
- Desktop hover mega-menu behavior was not separately captured.
- Search live reference states are manual-only, so header/search transition needs careful prototype review.
