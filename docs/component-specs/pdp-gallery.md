# PDP Gallery Component Spec

## Purpose

Render the single product image gallery with mobile scroll behavior and desktop image layout while preserving WooCommerce product media.

## Reference Sources

- Mobile gallery screenshot: `reference/fashionnova/pages/single-product/gallery/screenshot-mobile.png`
- Mobile gallery DOM: `reference/fashionnova/pages/single-product/gallery/dom.mobile.cleaned.html`
- Single product full-page screenshots: `reference/fashionnova/pages/single-product/full-page/screenshot-mobile.png`, `reference/fashionnova/pages/single-product/full-page/screenshot-desktop.png`

## Visual Structure

- Mobile: full-width image gallery starting below PDP header, captured box 375x532.
- Sale badge overlays first image when product is on sale.
- Desktop: image grid/column inferred from full-page capture, with product info sticky on the side.
- Images use object-cover/object-contain decision based on product photography but maintain stable reserved dimensions.

## Mobile Behavior

- Horizontal swipe or vertical scroll-snap gallery with native CSS.
- No third-party carousel library.
- Dots/arrows only if needed for clarity.
- Lazy-load non-first images.

## Desktop Behavior

- Desktop layout pairs gallery with sticky product info column.
- Multiple images should use a clean grid or stacked gallery matching full-page reference after approval.

## States

- Default, sale badge, loading skeleton, image error fallback, zoom/open lightbox if later approved.

## Data Dependencies

- WooCommerce product gallery image IDs and alt text.
- Sale badge state from WooCommerce/Advanced Woo Labels.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Use WooCommerce gallery data, not Shopify/Fashion Nova asset patterns.
- Avoid WooCommerce template changes until static prototype is approved and staging exists.
- Native lazy loading for secondary images.

## Accessibility Requirements

- Images need meaningful alt text or empty alt for decorative duplicates.
- Any carousel controls are real buttons with labels.
- Keyboard users can navigate images.
- Zoom/lightbox, if added, must trap focus.

## Acceptance Criteria

- Mobile gallery dimensions and badge placement match reference at 390px.
- Desktop gallery aligns with single product full-page reference.
- No layout shift as images load.
- No new JS libraries.

## Open Risks

- Gallery desktop component was not captured separately.
- MaChaussure image aspect/crop consistency may require preprocessing or CSS decisions.
