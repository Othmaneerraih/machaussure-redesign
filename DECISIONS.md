# DECISIONS LOG

## Format
```
### YYYY-MM-DD — Decision Title
- Context:
- Options considered:
- Decision:
- Reasoning:
- Reversible: yes / no
```

---

## Locked Decisions

### 2026-05-16 — Drop Woodmart, use GeneratePress Free
- Context: Rebuilding entire frontend to match Fashion Nova. Every Woodmart template would be overridden.
- Options: Keep Woodmart and override, GeneratePress Premium, GeneratePress Free, blank theme
- Decision: GeneratePress Free child theme
- Reasoning: 30KB footprint, zero conflicts, clean WooCommerce hooks, no cost. GP Premium adds admin conveniences we don't need since everything is coded manually.
- Reversible: yes

### 2026-05-16 — Elementor for homepage tab content only
- Context: Homepage needs rich editorial sections per category tab (banners, promos, curated grids). Rest of site is pure PHP templates.
- Decision: Keep Elementor active, use only for homepage tab content sections
- Reasoning: Already familiar with Elementor section templates for tabs. Faster than building a custom CMS for editorial content.
- Reversible: yes

### 2026-05-16 — FiboSearch Pro for search
- Context: Need AJAX instant search, search analytics, search history, trending/popular searches.
- Options: Custom AJAX search, FiboSearch Free, FiboSearch Pro, ElasticPress
- Decision: FiboSearch Pro
- Reasoning: Inverted index engine, fuzzy search, search history built-in, analytics dashboard, 100k+ active installs. Custom overlay UI wraps around it.
- Reversible: yes

### 2026-05-16 — FiboFilters Pro for filtering
- Context: Need cascading AND filters with live narrowing of available options. Fashion Nova style full-screen filter overlay.
- Options: FacetWP, FiboFilters Pro, custom AJAX filters
- Decision: FiboFilters Pro
- Reasoning: Same team as FiboSearch, shared index engine, native integration (FiboFilters can use FiboSearch Pro as search facet). GeneratePress integration confirmed. Custom mobile mode included. One vendor for both search and filters.
- Reversible: yes

### 2026-05-16 — TI WooCommerce Wishlist
- Context: Need heart icon on product cards + dedicated wishlist page.
- Options: YITH Wishlist, TI Wishlist, custom
- Decision: TI WooCommerce Wishlist (free)
- Reasoning: Most popular free option, well-maintained, provides heart icon toggle and wishlist page. Style with CSS.
- Reversible: yes

### 2026-05-16 — Custom SKU-based color linking
- Context: Woodmart linked variations will stop working when Woodmart Core is deactivated. Products already have consistent SKU pattern (XX-###-Color).
- Options: Flavor plugin ($79), Iconic plugin ($49), custom meta field, SKU-prefix query
- Decision: Custom PHP using first 6 SKU characters as group key
- Reasoning: Zero plugin dependency, works with existing data, ~50 lines PHP. Must be cached per group key.
- Reversible: yes (can add plugin later)

### 2026-05-16 — Checkout CSS-only restyle
- Context: CMI payment gateway, COD, Shipping Rate By Cities, Smart Coupons must all remain functional.
- Options: Full template rebuild, CSS-only restyle
- Decision: CSS-only restyle, no template override
- Reasoning: Touching checkout templates risks breaking payment/shipping/coupon logic. Visual changes achievable with CSS alone.
- Reversible: yes

### 2026-05-16 — Account login/register as overlay modal
- Context: Fashion Nova uses modal overlay for login/signup, not a page redirect.
- Decision: WooCommerce login/register forms loaded into overlay modal via AJAX
- Reversible: yes

### 2026-05-16 — Font: Proxima Nova with Arabic fallback
- Context: Fashion Nova uses Proxima Nova. Full family available (12 weights including italics). Site will support Arabic in the future.
- Decision: Convert TTF to WOFF2, load locally. Font stack includes Arabic-compatible fallback (Cairo, Noto Sans Arabic, or IBM Plex Sans Arabic). No CDN, no Google Fonts for primary font.
- Reversible: yes

### 2026-05-16 — Reference system: Fashion Nova global CSS as single source of truth
- Context: Found Fashion Nova's complete compiled stylesheet. Contains all CSS variables, typography classes, button variants, breakpoints.
- Decision: Store as `reference/fashionnova/_global/fashionnova.raw.css`. Codex reads it to decode class names. No manual spec.md needed per component — the CSS IS the spec.
- Reversible: no (this is the reference method)

### 2026-05-16 — ChatGPT as orchestrator, Codex as worker
- Context: Need a master controller for task order, prompt writing, and result review.
- Options: ChatGPT Project, Claude Project, manual
- Decision: ChatGPT Project as primary orchestrator. Claude as optional secondary reviewer.
- Reasoning: Codex is an OpenAI product. ChatGPT Projects keep instructions, files, and chats in one place. Avoids split-brain workflow between two AI ecosystems.
- Reversible: yes

### 2026-05-16 — RTL/Arabic readiness from day one
- Context: Site will offer Arabic language in the future. Retrofitting RTL onto physical CSS properties requires rewriting every directional rule.
- Options: Build LTR now and retrofit later, build RTL-ready from the start
- Decision: Use CSS logical properties throughout. No physical left/right/margin-left/padding-right in production CSS. Font stack includes Arabic-compatible fallback. Directional icons get RTL-flip class.
- Reasoning: Logical properties flip automatically with `dir="rtl"`. Zero extra cost if done from the start. Major cost if retrofitted later.
- Reversible: no (this is a convention, not a feature)

### 2026-05-16 — No analytics this sprint
- Context: GTM, GA4, Clarity integration needed but not for launch sprint.
- Decision: Analytics deferred to post-launch.
- Reversible: yes

---

## Plugin Inventory

Fill in exact versions before first WooCommerce integration session.

| Plugin | Version | Status |
|--------|---------|--------|
| WordPress | | |
| WooCommerce | | |
| GeneratePress Free | | |
| Elementor | | |
| FiboSearch Pro | | |
| FiboFilters Pro | | |
| TI WooCommerce Wishlist | | |
| WooCommerce CMI Gateway | | |
| Shipping Rate By Cities | | |
| Sequential Order Numbers | | |
| Smart Coupons | | |
| Advanced Woo Labels | | |
| WP Rocket | | |
| Yoast SEO | | |
| Code Snippets | | |
| PHP version | | |
| Staging URL | | |
| Production URL | machaussure.ma | |
