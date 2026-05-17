# MaChaussure Design Tokens From Fashion Nova References

These tokens translate the Fashion Nova reference CSS and captures into MaChaussure implementation language. Do not import Fashion Nova classes, assets, SVGs, fonts, or raw CSS. Production CSS must define MaChaussure custom properties and use logical properties.

## Font Family

- `--fn-font-family-base`: `Proxima Nova`, `Gill Sans MT`, `Arial`, `Cairo`, `Noto Sans Arabic`, sans-serif.
- Load Proxima Nova locally from MaChaussure-owned WOFF2 files only.
- Arabic fallback is mandatory from day one.
- Production letter spacing should default to `0` unless a future review explicitly approves a deviation.

## Type Scale

| Token | Size | Line height | Weight | Use |
|---|---:|---:|---:|---|
| `--fn-type-heading-4xl` | 60px | 54px | 900 | Large campaign headings only. |
| `--fn-type-heading-3xl` | 48px | 43px | 900 | Desktop page/campaign headings. |
| `--fn-type-heading-2xl` | 36px | 32px | 900 | Large section titles. |
| `--fn-type-heading-xl` | 28px | 25px | 900 | Modal/page headers when large. |
| `--fn-type-heading-lg` | 19px | 19px | 900 | Primary compact headings. |
| `--fn-type-heading-md` | 17px | 17px | 900 | Drawer headings, strong labels. |
| `--fn-type-heading-sm` | 15px | 18px | 900 | Filter/header labels. |
| `--fn-type-heading-xs` | 12px | 14px | 900 | Pills, tabs, micro uppercase. |
| `--fn-type-body-xl` | 21px | 25px | 400/600 | Rare large body text. |
| `--fn-type-body-lg` | 17px | 24px | 400/600 | Product prices and larger body. |
| `--fn-type-body-md` | 15px | 24px regular; 21px bold | 400/600 | Form fields, body copy. |
| `--fn-type-body-sm` | 13px | 21px regular; 16px bold | 400/600 | Product card title, links, drawer labels. |
| `--fn-type-body-xs` | 12px | 17px | 400/600 | Buttons, captions, promos. |
| `--fn-type-body-2xs` | 11px | 13px | 400/600 | Tiny helper text. |
| `--fn-type-body-3xs` | 10px | 12px | 400/700 | Sale badges and micro badges. |

## Color Tokens

| Token | Value | Use |
|---|---:|---|
| `--fn-color-white` | `#ffffff` | Page and overlay surfaces. |
| `--fn-color-neutral-200` | `#f8f8f8` | Light backgrounds. |
| `--fn-color-neutral-300` | `#efefef` | Disabled fills, skeletons. |
| `--fn-color-neutral-400` | `#e6e6e6` | Borders and dividers. |
| `--fn-color-neutral-500` | `#bebebe` | Muted icon/border states. |
| `--fn-color-neutral-600` | `#757575` | Secondary text. |
| `--fn-color-neutral-800` | `#272727` | Hover black. |
| `--fn-color-black` | `#000000` | Primary text and primary buttons. |
| `--fn-color-sale` | `#9d2226` | Sale price, promo badge, discount icon. |
| `--fn-color-error` | `#be2d2e` | Error text and invalid fields. |
| `--fn-color-success` | `#2e832c` | Success states. |
| `--fn-color-star` | `#fabd05` | Review stars. |
| `--fn-color-link` | `#0071e3` | Focus and blue links. |
| `--fn-color-pink-link` | `#ce548e` | Optional accent links. |
| `--fn-color-promo-bg` | `#eaf3ea` | Promo panel background. |
| `--fn-color-promo-text` | `#1c4f1a` | Promo panel text. |

## Spacing Scale

Use a custom-property scale and consume it through logical properties:

| Token | Value |
|---|---:|
| `--fn-space-0` | 0 |
| `--fn-space-1` | 2px |
| `--fn-space-2` | 4px |
| `--fn-space-3` | 6px |
| `--fn-space-4` | 8px |
| `--fn-space-5` | 10px |
| `--fn-space-6` | 12px |
| `--fn-space-8` | 16px |
| `--fn-space-10` | 20px |
| `--fn-space-12` | 24px |
| `--fn-space-14` | 28px |
| `--fn-space-16` | 32px |
| `--fn-space-20` | 40px |
| `--fn-space-22` | 44px |
| `--fn-space-24` | 48px |
| `--fn-space-32` | 64px |
| `--fn-space-40` | 80px |

Common captured spacing:
- Mobile page gutters: 16px.
- Desktop header horizontal padding: 32px.
- Product card info inset: 8px mobile, 0-24px desktop.
- Filter drawer internal padding: 16px sides, 24px top, 64px bottom breathing room above fixed footer.

## Radius Tokens

| Token | Value | Use |
|---|---:|---|
| `--fn-radius-none` | 0 | Product images and square surfaces. |
| `--fn-radius-xs` | 2px | Tiny payment badges. |
| `--fn-radius-sm` | 4px | Squared buttons and compact controls. |
| `--fn-radius-md` | 8px | Accordions and small panels. |
| `--fn-radius-lg` | 12px | Optional larger panels. |
| `--fn-radius-search` | 26px | Header search input. |
| `--fn-radius-pill` | 90px | Promo badges and pill buttons. |
| `--fn-radius-full` | 9999px | Round icon buttons, swatches. |

## Button Tokens

All buttons use 15px font size, 21px line height, 600 weight, 48px default height, 32px inline padding, `inline-flex`, center alignment, and active transform `scale(.98)`.

| Token | Surface | Text | Border | Radius | Notes |
|---|---|---|---|---|---|
| `--fn-button-primary` | black | white | none | full | Add to bag, apply filters, primary submit. |
| `--fn-button-secondary` | neutral-300 | black | none | full | Secondary actions; hover neutral-400. |
| `--fn-button-light` | white | black | black | full | Alternate action on white surface. |
| `--fn-button-transparent` | transparent | black | black | pill | Less common overlay action. |
| `--fn-button-primary-square` | black | white | black | 4px | Checkout/form square variant. |
| `--fn-button-light-square` | white | black | neutral-400 | 4px | Chips and form-adjacent buttons. |
| `--fn-button-small` | inherited | inherited | inherited | inherited | 36px height, 16px inline padding. |
| `--fn-button-large` | inherited | inherited | inherited | inherited | 44px height, 32px inline padding. |
| `--fn-button-full` | inherited | inherited | inherited | inherited | Width 100%, 16px inline padding. |

## Breakpoints

Reference breakpoints found in the global CSS:

| Token | Width | Notes |
|---|---:|---|
| `--fn-bp-xxs` | 344px | Very small phones. |
| `--fn-bp-xs` | 375px | Baseline iPhone-ish width; extractor uses 390px viewport with 375px content. |
| `--fn-bp-se` | 376px | Slightly above 375px. |
| `--fn-bp-sm` | 639px | Large phone/small tablet. |
| `--fn-bp-md` | 767px | Tablet and medium rules. |
| `--fn-bp-lg` | 989px | Desktop product layout begins. |
| `--fn-bp-header` | 1092px | Desktop header mode. |
| `--fn-bp-xl` | 1179px | Wider desktop. |
| `--fn-bp-2xl` | 1366px | Large desktop. |
| `--fn-bp-2-5xl` | 1600px | Very wide. |
| `--fn-bp-3xl` | 1800px | Very wide grid expansions. |
| `--fn-bp-max` | 2800px | Max container. |

Implementation remains mobile-first with base styles targeted at 390px and `min-width` media queries.

## Header, Sticky, And Z-Index

- Mobile header live capture: 375x141 after countdown banner.
- Desktop header live capture: 1425x96 after countdown banner.
- Countdown banner: 59px mobile, 44px desktop.
- Header search height: 44px with 26px radius and 2px neutral border.
- Sticky filter bar: 343x44, inset 16px from viewport edges on mobile.
- Use `--fn-z-header: 40`, `--fn-z-sticky: 50`, `--fn-z-drawer: 1000`, `--fn-z-modal: 9998`, `--fn-z-toast: 9999` as MaChaussure aliases.
- Body scroll lock is required whenever drawers/overlays are open.

## Overlay And Drawer Dimensions

Captured mobile element boxes:

| Overlay | Box | Placement notes |
|---|---:|---|
| Sign in | 375x350 | Bottom sheet from lower viewport. |
| Sign up | 375x621 | Taller bottom sheet. |
| Forgot password | manual-only | Follow sign-in sheet style; no screenshot. |
| Search idle/results | manual-only | Treat as full-screen mobile search surface. |
| Search by image | 375x347 | Bottom dialog. |
| Menu | 375x704 | Starts below header; scrollable body. |
| Reviews | 375x760 | Tall review dialog, scrollable. |
| Added to cart | 375x796 | Almost full-height drawer after product add. |
| Filter open/selected | 375x844 | Full mobile drawer with sticky header and fixed footer. |
| Size guide | 375x675 | Bottom sheet/table surface. |

## Product Grid And Card Tokens

- Mobile archive card box: 187x363 at 390px viewport, effectively two columns.
- Desktop archive card box: 282x506 at 1440px viewport.
- Product image ratio: about 2:3 (`--fn-product-image-ratio: 2 / 3`) from `149.7006%` padding hack.
- Product image should reserve layout space before image load to avoid CLS.
- Product card mobile quick add icon: 32px circular button over image bottom end.
- Desktop quick-add size tray appears on hover/focus, with 85% white backdrop and 25px blur.
- Size chips in card tray: 32px high, 32-48px wide.
- Swatches: 20px circle, 2px active border, 4px tap padding.
- Product badge: 10px/12px type, sale red background, white text, pill radius, 8px/4px padding.

## Forms

- Inputs keep 16px base font to avoid mobile zoom.
- Form controls use white backgrounds, 1px neutral-400 borders, visible focus ring in blue.
- Password reveal is a real button.
- Labels must be associated with inputs; placeholders are not labels.
- Error/success states use red/success tokens and do not rely on color alone.

## RTL Readiness

- All production CSS must use logical properties.
- Directional icons get `.fn-icon--rtl-flip` and flip under `[dir="rtl"]`.
- Captured physical placement from Fashion Nova should be translated to logical equivalents during implementation.
