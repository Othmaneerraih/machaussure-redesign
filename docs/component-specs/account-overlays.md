# Account Overlays Component Spec

## Purpose

Provide login, registration, and forgot-password overlays instead of page redirects, while preserving WooCommerce account behavior.

## Reference Sources

- Sign in screenshot: `reference/fashionnova/overlays/sign-in/screenshot-mobile.png`
- Sign in DOM: `reference/fashionnova/overlays/sign-in/dom.mobile.cleaned.html`
- Sign up screenshot: `reference/fashionnova/overlays/sign-up/screenshot-mobile.png`
- Sign up DOM: `reference/fashionnova/overlays/sign-up/dom.mobile.cleaned.html`
- Forgot password manual DOM: `reference/fashionnova/_manual/overlays/sign-in-forgot-password/dom-forgot-password.mobile.manual.cleaned.html`

Forgot-password reference is manual-only, not screenshot-backed, not live extractor output, and must not be copied into production.

## Visual Structure

- Bottom-sheet modal on mobile with white surface, centered heading, compact form fields, password show button, primary submit, and legal/terms copy.
- Sign in captured at 375x350.
- Sign up captured at 375x621 and includes first name, last name, password rules, phone/country selector.
- Forgot password contains email input, submit, back-to-login, sent confirmation, and close state.

## Mobile Behavior

- Opens from account icon without full page navigation.
- Body scroll locks; focus moves to first field.
- Sign in/sign up/forgot password switch within the same modal shell.
- After successful auth, close modal and refresh account/cart/wishlist fragments if needed.

## Desktop Behavior

- Use centered modal or right/bottom drawer depending prototype approval.
- Width should stay compact, roughly 400-460px max.

## States

- Sign in, sign up, forgot password form, forgot password confirmation, loading, validation error, auth failure, success.

## Data Dependencies

- WooCommerce login/register/lost password endpoints and nonces.
- WordPress user account fields.
- Optional first/last name and phone fields if MaChaussure account policy requires them.

## WooCommerce/FiboSearch/FiboFilters/TI Wishlist Integration Notes

- Use WooCommerce forms or AJAX endpoints, not custom auth logic.
- Preserve nonces, password reset emails, and security behavior.
- No inline scripts or styles.
- Strings must be translatable in French and later Arabic.

## Accessibility Requirements

- `role="dialog"` with `aria-modal="true"`.
- Focus trap, Escape close, and return focus to account trigger.
- Inputs have labels and error text tied with `aria-describedby`.
- Password show/hide is a button with pressed state.
- Legal links are real links.

## Acceptance Criteria

- Login, register, and reset flows submit through WooCommerce on staging.
- Mobile dimensions and hierarchy match references after approval.
- Validation errors are visible and announced.
- No page redirect occurs unless JavaScript is disabled.

## Open Risks

- Registration fields may differ from Fashion Nova and must match MaChaussure policy.
- Social login is not in scope unless later added.
- Forgot password has manual-only visual guidance.
