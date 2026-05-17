# Product Card Component Spec

## Purpose

Define the reusable product card for archive grids, recommendations, cart/wishlist recommendations, and related products.

## Reference Sources

- Live mobile screenshot: `reference/fashionnova/pages/product-archive/screenshot-card-mobile.png`
- Live desktop screenshot: `reference/fashionnova/pages/product-archive/screenshot-card-desktop.png`
- DOM: `reference/fashionnova/pages/product-archive/dom-product-card.mobile.cleaned.html`
- DOM: `reference/fashionnova/pages/product-archive/dom-product-card.desktop.cleaned.html`
- Metadata: `reference/fashionnova/pages/product-archive/product-card.metadata.json`

## Visual Structure

- Product image in reserved 2:3 frame with sale badge at block-start/inline-start.
- Quick-add bag icon overlays image bottom inline-end on mobile.
- Desktop hover/focus reveals quick-add size tray over image bottom.
- Product title is one line.
- Wishlist heart sits inline-end of title row.
- Price row shows sale price in sale red and compare-at price struck through.
- Promo tagline row uses sale icon and code text.
- Color swatches sit below price/promo when linked color variants exist.

## Mobile Behavior

- Two-column grid. Captured card box is 187x363.
- Quick-add icon opens size selection or adds if only one size.
- Title truncates to one line.
- Swatches remain tappable without shifting card height.

## Desktop Behavior

- Captured card box is 282x506.
- Size tray appears on hover and keyboard focus.
- Quick-add tray includes 32px high size buttons and unavailable bell/state.

## States

- Default, hover, focus, sale, regular price, out of stock, low stock, wishlist active/inactive, quick-add open, size selected, unavailable size, loading add-to-cart.

## Data Dependencies

- WooCommerce product title, permalink, image, prices, sale state, stock status.
- Product sizes/attributes.
- SKU-prefix linked color products with cached lookup.
- TI Wishlist active state.
- Advanced Woo Labels if badge data is provided.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- WooCommerce loops render clean semantic card markup, not Fashion Nova DOM.
- Color-linked products query by first 6 SKU characters and must be cached per group key.
- TI Wishlist controls can be restyled or wrapped, but plugin logic remains intact.
- Quick add must use WooCommerce add-to-cart endpoints/fragments.

## Accessibility Requirements

- Image link has meaningful accessible name.
- Wishlist is a button with pressed/active state.
- Quick-add size group has label and selected/unavailable states.
- Loading add-to-cart state is announced.
- Keyboard can reveal and use desktop size tray.

## Acceptance Criteria

- Static prototype matches reference card at 390px and 1440px after approval.
- Image frame reserves layout space and avoids CLS.
- Wishlist and quick-add work without nested interactive elements.
- Color swatches link to sibling product URLs and active swatch is clear.

## Open Risks

- Product images from MaChaussure may not have Fashion Nova crop consistency.
- Quick-add behavior depends on WooCommerce variation/product type data.
- Product card is the next critical prototype and should be visually approved before archive integration.
