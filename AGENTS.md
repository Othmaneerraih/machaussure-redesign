# AGENTS.md

## Project
Machaussure.ma — WooCommerce shoe store redesign.
Pixel-perfect Fashion Nova mobile-first UI clone.
French (fr_FR), Moroccan market, MAD currency.
~4,200 products with 2-5 color variants as separate linked products.
Arabic (RTL) language support planned for the future.

## Source of Truth Hierarchy
1. GitHub repo files (highest authority)
2. This AGENTS.md
3. TASK_BOARD.md
4. DECISIONS.md
5. BUILD_LOG.md
6. DEBUG_LOG.md
7. Reference component files
8. Current session prompt
9. Old chat history (lowest — do not trust)

## Architecture
- WordPress + WooCommerce = commerce engine (never replace)
- GeneratePress Free = base theme
- Custom child theme = all frontend code
- Elementor = homepage tab content ONLY, nowhere else
- No Woodmart. No other page builders outside homepage.

## Orchestrator Mode
The Codex side chat acts as the orchestrator. The main chat acts as the worker.

**Side chat (orchestrator):**
- Reads AGENTS.md, TASK_BOARD.md, BUILD_LOG.md, DECISIONS.md
- Determines the next task based on phase gates and reference status
- Writes the exact prompt for the main chat worker session
- Reviews results when reported
- Does NOT write production code

**Main chat (worker):**
- Executes the prompt given to it
- Writes code, modifies files
- Updates BUILD_LOG.md and TASK_BOARD.md
- Does NOT decide the next major phase independently

If a worker session needs to modify files outside its assigned scope, it must stop and report.

## Reference System
- `reference/fashionnova/_global/fashionnova.raw.css` — Fashion Nova's complete compiled stylesheet. Single source of truth for all design values.
- `reference/fashionnova/[category]/[component]/dom.raw.html` — rendered HTML per component
- `reference/fashionnova/[category]/[component]/screenshot-mobile.png` — visual target
- Font: Proxima Nova (full family, loaded locally as WOFF2) with Arabic-compatible fallback font

Codex must read `fashionnova.raw.css` to decode all class names, CSS variables, typography classes, button variants, and breakpoints. Do not guess values — look them up in the reference CSS.

## Legal and IP Rules
Fashion Nova HTML/CSS/assets are reference artifacts only.
Do not paste full third-party CSS into production files.
Do not use their font files, images, icons, scripts, or proprietary assets.
Rebuild clean semantic HTML/CSS using extracted measurements and behavior.
Raw Fashion Nova HTML goes only into `reference/`. Never into production templates.

## Plugins
| Plugin | Purpose | Rule |
|--------|---------|------|
| WooCommerce | Commerce engine | Never edit plugin files. Hooks only. |
| GeneratePress Free | Base theme | Do not edit parent theme files. |
| Elementor | Homepage tab content only | Do not use on any other page. |
| FiboSearch Pro | AJAX search + analytics | Build custom overlay shell around it. |
| FiboFilters Pro | Cascading AND filters | Build custom overlay UI around it. Style its mobile mode or replace with custom drawer. |
| TI WooCommerce Wishlist | Heart icon + wishlist page | Style with CSS, use its PHP hooks. |
| WooCommerce CMI Gateway | Payment | Must remain functional. Never touch. |
| Shipping Rate By Cities | Regional shipping | Must remain functional. |
| Sequential Order Numbers | Order numbering | Must remain functional. |
| Smart Coupons | Promo codes | Must remain functional. |
| Advanced Woo Labels | Product badges | Must remain functional. |
| WP Rocket | Caching | Disable on staging during build. Re-enable for QA. |
| Yoast SEO | SEO | Must remain functional. |
| Code Snippets | Temporary experiments only | Production logic must live in the repo, not in WP admin. |

## Linked Color Variations
Products are linked by SKU prefix. Pattern: first 6 characters (XX-###, e.g. `TE-593`).
Query all products sharing the same SKU prefix. Display as color pills on product page.
Each pill links to that product's URL. Current product gets active state.
Custom PHP, no plugin.

**Performance rule:** Color-linking queries must be cached by SKU group key. Cache invalidates on product save, SKU change, or stock/status change. Never run uncached SKU-prefix queries inside product loops.

## Build Sequence (mandatory)
For every component:
1. Extract reference (dom.raw.html + screenshot from Fashion Nova)
2. Normalize reference (Codex SPEC session produces used-rules.css, component-spec.md, acceptance.md)
3. Build static HTML/CSS prototype with fake data
4. Verify prototype matches reference screenshot (manual visual check)
5. Integrate into WooCommerce templates
6. Test on staging (manual)

Do not skip to WooCommerce integration before the static prototype is visually verified.

## Staging
No WooCommerce integration task may begin until staging URL is confirmed and tested.
Backup live site database + files before any staging work.

## Conventions

### CSS
- Mobile-first: base styles for 390px. `min-width` media queries for larger.
- All values via CSS custom properties. Never hardcode colors, fonts, spacing.
- BEM naming: `.fn-[component]__[element]--[modifier]`
- One file per component area.
- No `!important` unless overriding a plugin.
- No CSS frameworks. No Tailwind. No utility classes.

### RTL / Arabic Readiness
This site will support Arabic (RTL) in the future.
All CSS must use logical properties from day one:
- `margin-inline-start` / `margin-inline-end` (not `margin-left` / `margin-right`)
- `padding-inline-start` / `padding-inline-end` (not `padding-left` / `padding-right`)
- `padding-inline` / `margin-inline` for shorthand
- `inset-inline-start` / `inset-inline-end` (not `left` / `right` for positioned elements)
- `border-inline-start` / `border-inline-end` (not `border-left` / `border-right`)
- `text-align: start` / `text-align: end` (not `text-align: left` / `text-align: right`)
- `float: inline-start` (not `float: left`)

Exceptions where physical properties are acceptable:
- Decorative offsets that should NOT flip (rare)
- Must be marked with a comment: `/* physical: intentional, do not flip */`

Font stack must include an Arabic-compatible fallback (Cairo, Noto Sans Arabic, or IBM Plex Sans Arabic).

Directional icons (arrows, chevrons, back buttons) must have `.fn-icon--rtl-flip` class that applies `transform: scaleX(-1)` when `[dir="rtl"]` is active.

### JavaScript
- Vanilla JS by default. No new jQuery dependency.
- Interacting with existing WooCommerce/jQuery events is allowed only when required.
- ES6+. Each file self-contained (IIFE or module).
- AJAX via native `fetch()`. Selectors use `.fn-*` classes only.

### PHP
- WordPress coding standards. All output escaped.
- Template parts via `get_template_part()`.
- WooCommerce hooks in a dedicated includes file. Never edit plugin files.
- All strings translatable: `__('text', 'machaussure')`
- No inline styles. No inline scripts.

### Performance
- No external CDN dependencies. Fonts loaded locally.
- No JS libraries (no Swiper, Slick, GSAP). CSS scroll-snap + minimal JS for carousels.
- Images lazy-loaded via native `loading="lazy"`.
- Total custom CSS budget: under 80KB. Total custom JS: under 60KB.
- No unnecessary AJAX on page load.
- Avoid layout shifts in product grid.

### Accessibility
- Buttons are real `<button>` elements. Links are real `<a>` elements.
- Modals/overlays trap focus and close with Escape key.
- Body scroll lock when overlays are open.
- Inputs have associated labels.
- `aria-expanded` on accordions and toggles.
- Visible focus states on all interactive elements.

## Checkout
CSS-only restyle. No template override.
Preserve all form fields, nonces, payment hooks.
Checkout changes require a REVIEW session before merge.
Checkout changes require a manual test order on staging.
Checkout changes require a rollback branch/tag.

## Account
Login/register as overlay modal (not page redirect).
My Account pages: CSS restyle only.

## Validation
Before any task is done:
- PHP syntax check passes
- No console errors at 390px viewport
- No PHP warnings in debug.log
- Visual match against reference screenshot at 390px AND 1440px
- WooCommerce cart to checkout flow still works
- List files changed and flag risks

## Forbidden
- Editing vendor/plugin/core/parent-theme files
- Broad refactors during feature tasks
- Adding JS libraries or CSS frameworks without approval
- Modifying payment/order/shipping logic unless explicitly scoped
- Deleting or restructuring files from previous sessions
- Skipping static prototype step
- Using Elementor outside homepage tab content
- Running raw Fashion Nova HTML in production templates
- Batching checkout/cart/account changes together
- Using physical CSS directional properties (left/right/margin-left/padding-right) instead of logical properties

