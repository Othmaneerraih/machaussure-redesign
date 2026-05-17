# My Account Components Spec

## Purpose

Restyle WooCommerce My Account dashboard, orders, and account information pages to align with the Fashion Nova account references.

## Reference Sources

- Dashboard manual DOM: `reference/fashionnova/_manual/pages/my-account/dashboard/dom-dashboard.mobile.manual.cleaned.html`
- Orders manual DOM: `reference/fashionnova/_manual/pages/my-account/orders/dom-orders.mobile.manual.cleaned.html`
- My info manual DOM: `reference/fashionnova/_manual/pages/my-account/my-info/dom-my-info.mobile.manual.cleaned.html`
- Manual audit: `reference/fashionnova/_manual/SOURCE_AUDIT.md`

All account page references are manual-only, not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Account section uses horizontal or vertical endpoint navigation: Dashboard, My orders, My info.
- Dashboard shows account greeting/overview, notifications/list links where applicable, and account content.
- Orders page shows order list/history with empty state if no orders.
- My info page shows account details/address forms using compact field styling.

## Mobile Behavior

- Account nav appears near top under site chrome.
- Endpoint content stacks in one column.
- Forms use full-width inputs and primary actions.

## Desktop Behavior

- Account nav can become sidebar or top tabs depending WooCommerce template constraints.
- Content width should stay readable and not become a marketing layout.

## States

- Logged out, logged in dashboard, orders empty, orders with data, account info edit, validation error, save success.

## Data Dependencies

- WooCommerce account endpoints.
- User profile fields.
- Billing/shipping addresses.
- Order history.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- My Account pages are CSS restyle only unless later scoped.
- Login/register happens through account overlay, not forced page redirect for normal header account flow.
- Preserve WooCommerce endpoint URLs and forms.

## Accessibility Requirements

- Endpoint navigation indicates current page.
- Forms retain labels and error messages.
- Order tables/lists use semantic structure.
- Save buttons are real buttons.

## Acceptance Criteria

- Manual reference hierarchy is translated into MaChaussure/WooCommerce account pages.
- WooCommerce endpoint navigation and forms remain functional.
- No account data or order logic is changed.

## Open Risks

- Account references include logged-in/cart overlay state and non-US currency from manual capture.
- No live screenshot-backed account reference exists.
