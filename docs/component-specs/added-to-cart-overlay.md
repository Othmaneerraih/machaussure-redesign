# Added To Cart Overlay Component Spec

## Purpose

Display a post-add-to-cart confirmation drawer with product summary, view bag action, account sync prompt, and cross-sell products.

## Reference Sources

- Live screenshot: `reference/fashionnova/overlays/added-to-cart/screenshot-mobile.png`
- DOM: `reference/fashionnova/overlays/added-to-cart/dom.mobile.cleaned.html`
- Metadata: `reference/fashionnova/overlays/added-to-cart/metadata.json`

## Visual Structure

- Tall mobile drawer/dialog, captured at 375x796.
- Header: `Added to bag`.
- Added product summary: image, title, sale/compare price, promo code, selected size/color.
- Primary action: view bag with item count.
- Account sync/sign-in prompt.
- Often-bought-together product cards with compact add controls.

## Mobile Behavior

- Opens after successful WooCommerce add-to-cart.
- Body scroll locks.
- View bag routes to cart.
- Cross-sell add controls can add products without closing unless prototype chooses otherwise.

## Desktop Behavior

- Use right drawer or centered modal, depending static prototype approval.
- Keep product summary and cross-sells visible without excessive height.

## States

- Opening, product added, add failed, cross-sell loading, cross-sell added, signed-in/signed-out account prompt, cart count updated.

## Data Dependencies

- WooCommerce cart item just added.
- Cart count and item URL.
- Cross-sells/upsells or related product query.
- Account login state.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Must hook into WooCommerce add-to-cart events/fragments.
- Do not interfere with payment, shipping, or checkout logic.
- Product card subcomponents should reuse product-card spec at compact scale.

## Accessibility Requirements

- Dialog label announces added item.
- Focus moves to drawer title or primary action.
- Cart count updates are announced.
- Escape closes and returns focus to triggering Add to Bag.

## Acceptance Criteria

- Drawer appears only after successful add.
- Cart count and item count match WooCommerce state.
- 390px layout matches reference after visual approval.
- Cart/checkout flow still works after close.

## Open Risks

- Cross-sell product source and inventory rules need confirmation.
- WooCommerce AJAX add-to-cart behavior differs by product type.
