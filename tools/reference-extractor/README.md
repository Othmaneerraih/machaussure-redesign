# Reference Extractor

Local Playwright extractor for Fashion Nova reference components. It is manifest-driven so Codex Browser can be used to discover selectors, then this tool can capture `outerHTML`, cleaned DOM, screenshots, and metadata.

## Install

From the repository root:

```powershell
cd tools\reference-extractor
npm install
npx playwright install chromium
```

## Validate The Manifest

Validation checks manifest shape only. It does not open a browser.

```powershell
npm run validate
```

## List Entries

```powershell
npm run list
```

This prints every manifest id, status, capture mode, URL, and output path.

## Generate Review Index

```powershell
npm run review
```

This scans generated live extractor outputs and installed manual references under `reference/fashionnova/_manual/`, then writes:

- `reference/fashionnova/_review/index.html`
- `reference/fashionnova/_review/review-report.md`

Manual references are clearly labeled `manual-reference`, `not-live-extractor-output`, and `not screenshot-backed` unless a screenshot exists beside the manual DOM.

## Run All Approved Entries

```powershell
npm run extract
```

Entries with `"status": "needs-selector"` are skipped cleanly and listed in the skipped summary.

## Run One Entry

```powershell
npm run extract -- --id product-archive-product-card
```

## Run Multiple Entries

```powershell
npm run extract -- --ids product-archive-product-card,navigation-header
```

## Add A New Selector

In `manifest.json`, find the placeholder entry and update:

- remove `"status": "needs-selector"` or set `"status": "ready"`
- set `url`
- set `viewports` to `["mobile"]`, `["desktop"]`, or `["mobile", "desktop"]`
- set `captureMode` to `"element"` or `"fullPage"`
- set `target` for element captures
- add any required `actions`
- confirm the output file names

Element captures validate that the target selector matches exactly one visible element with a bounding box larger than `50px` by `50px`, and that `outerHTML` is longer than 100 characters.

Use per-entry validation overrides only for deliberately small components:

```json
"validation": {
  "minHeight": 20
}
```

The default minimum remains `50px` for width and height when no override is present.

## Mark An Entry As Needs Selector

Use:

```json
"status": "needs-selector"
```

The extractor skips these entries during normal extraction. `npm run validate` still checks their structural fields so the manifest remains useful as the reference backlog.

## Actions

Actions run after page load and transient modal dismissal, before capture:

```json
"actions": [
  { "type": "click", "selector": "..." },
  { "type": "fill", "selector": "...", "value": "heels" },
  { "type": "wait", "ms": 1000 },
  { "type": "waitForSelector", "selector": "..." },
  { "type": "goto", "url": "https://www.fashionnova.com/cart" },
  { "type": "scroll", "y": 600 }
]
```

Each viewport runs in a fresh browser page with the viewport set before navigation. Element screenshots wait for a stable bounding box and loaded images before capture.

## Outputs

Each approved extraction writes:

- viewport-specific raw DOM
- viewport-specific cleaned DOM
- mobile screenshot when `mobile` is requested
- desktop screenshot when `desktop` is requested
- metadata JSON

DOM outputs are always viewport-safe. If the manifest uses:

```json
"rawDom": "dom-product-card.raw.html",
"cleanDom": "dom-product-card.cleaned.html"
```

then a mobile and desktop extraction writes:

```text
dom-product-card.mobile.raw.html
dom-product-card.mobile.cleaned.html
dom-product-card.desktop.raw.html
dom-product-card.desktop.cleaned.html
```

Cleaning removes `link[rel="modulepreload"]`, `script`, `style`, `noscript`, `template`, and comments from a cloned DOM. It keeps classes, `data-testid`, inline styles, ARIA attributes, links, image attributes, SVG, visible text, and button/link/input structure.

## Verify Screenshots

After extraction, open the generated screenshot in `reference/fashionnova/...` and confirm:

- element captures show exactly the intended component
- full-page captures include the expected page state
- mobile captures match a `390x844` viewport
- desktop captures match a `1440x1000` viewport

For the product-card pilot, verify:

- `reference/fashionnova/pages/product-archive/dom-product-card.mobile.raw.html`
- `reference/fashionnova/pages/product-archive/dom-product-card.mobile.cleaned.html`
- `reference/fashionnova/pages/product-archive/dom-product-card.desktop.raw.html`
- `reference/fashionnova/pages/product-archive/dom-product-card.desktop.cleaned.html`
- `reference/fashionnova/pages/product-archive/screenshot-card-mobile.png`
- `reference/fashionnova/pages/product-archive/screenshot-card-desktop.png`
- `reference/fashionnova/pages/product-archive/product-card.metadata.json`

The metadata `captures` array stores one record per viewport with `viewportLabel`, `rawDomPath`, `cleanedDomPath`, `screenshotPath`, `boundingBox`, and `outerHTMLLength`.

Metadata top-level fields describe the component, not a specific viewport:

```json
{
  "id": "product-archive-product-card",
  "url": "https://www.fashionnova.com/collections/shoes",
  "requestedUrl": "https://www.fashionnova.com/collections/shoes",
  "selector": "[data-testid=\"grid-container\"] ...",
  "captureMode": "element",
  "timestamp": "2026-05-17T00:00:00.000Z",
  "actionsRun": [],
  "captures": [
    {
      "viewportLabel": "mobile",
      "viewport": { "width": 390, "height": 844 },
      "url": "https://www.fashionnova.com/collections/shoes",
      "rawDomPath": "reference/fashionnova/pages/product-archive/dom-product-card.mobile.raw.html",
      "cleanedDomPath": "reference/fashionnova/pages/product-archive/dom-product-card.mobile.cleaned.html",
      "screenshotPath": "reference/fashionnova/pages/product-archive/screenshot-card-mobile.png",
      "boundingBox": { "x": 188, "y": 264, "width": 187, "height": 353.33 },
      "outerHTMLLength": 32701
    }
  ]
}
```

## When Validation Fails

If extraction fails, the error prints the component id, selector, and reason. Do not hand-edit fake output. Fix the manifest selector or actions, then rerun the same id:

```powershell
npm run extract -- --id product-archive-product-card
```
