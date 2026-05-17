# My Account Page Spec

## Page Layout Order

1. Global banners/header.
2. Account endpoint navigation.
3. Endpoint content: dashboard, orders, or my info.
4. Optional recommendations/help links if scoped later.

## Components Used

- `notice-banners`
- `navigation-header`
- `my-account-components`
- `account-overlays`

## Mobile Layout

- Account nav appears near top as tabs/stacked links.
- Dashboard, orders, and my info content are one column.
- Forms use full-width fields and compact primary actions.

## Desktop Layout

- Account nav can become sidebar or horizontal tabs.
- Content max width remains readable.

## Sticky Behavior

- Header sticky applies.
- Account nav can remain static unless prototype shows need for sticky tabs.

## Empty States

- Orders empty state uses WooCommerce no-orders message with shop link.
- Missing account info/address uses WooCommerce edit prompt.
- Logged-out users are routed to login overlay or WooCommerce fallback page.

## Plugin Dependencies

- WooCommerce My Account endpoints.
- WooCommerce account forms and order history.

## Acceptance Criteria

- Dashboard, orders, and my info follow manual reference hierarchy.
- WooCommerce endpoint navigation and forms remain functional.
- Manual-only DOM is not copied into production.
- Login/register overlay works as primary header account flow.
