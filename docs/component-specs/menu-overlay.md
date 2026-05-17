# Menu Overlay Component Spec

## Purpose

Define the mobile hamburger menu drawer containing promotion, primary navigation, regional settings, help/company/legal links, and email signup.

## Reference Sources

- Live screenshot: `reference/fashionnova/overlays/menu/screenshot-mobile.png`
- DOM: `reference/fashionnova/overlays/menu/dom.mobile.cleaned.html`
- Metadata: `reference/fashionnova/overlays/menu/metadata.json`

## Visual Structure

- White full-width drawer below header, captured at 375x704.
- Top promo line, category link stack, location/currency section, grouped footer links, newsletter signup, legal links.
- Links are compact body-xs/body-sm with clear group headings and generous tap rows.

## Mobile Behavior

- Opens from header menu trigger.
- Scrolls internally while body remains locked.
- Close control returns focus to trigger.
- Category links navigate normally.

## Desktop Behavior

- Desktop menu overlay is optional if desktop header covers navigation.
- If used, display as an anchored panel using same content groups.

## States

- Closed, open, active category, expanded group, newsletter loading/success/error.

## Data Dependencies

- WordPress menu locations for categories/footer links.
- Locale/currency data for Morocco/MAD.
- Newsletter provider or WooCommerce/marketing integration if available.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Do not use Elementor for menu content.
- Use vanilla JS for open/close/focus trap.
- Keep links data-driven through WordPress menus where practical.

## Accessibility Requirements

- Dialog label identifies menu.
- Focus trap and Escape close.
- Groups use headings; links remain links.
- Newsletter input has an associated label and error/success messages.

## Acceptance Criteria

- At 390px, drawer starts below header and matches captured density.
- Menu scroll does not scroll page behind it.
- All links are keyboard reachable and visible focus states appear.

## Open Risks

- Exact MaChaussure menu taxonomy may differ from Fashion Nova.
- Location/currency selector behavior needs a future internationalization decision.
