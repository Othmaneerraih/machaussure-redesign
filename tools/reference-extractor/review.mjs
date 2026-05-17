import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const referenceRoot = path.join(repoRoot, "reference", "fashionnova");
const reviewDir = path.join(referenceRoot, "_review");
const manifestPath = path.join(__dirname, "manifest.json");

main().catch((error) => {
  console.error(`Review generation failed: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const allFiles = (await walk(referenceRoot)).filter(
    (filePath) => !toRepoPath(filePath).startsWith("reference/fashionnova/_review/")
  );

  const liveCaptures = await collectLiveCaptures(allFiles);
  const manualCaptures = await collectManualCaptures(allFiles);
  const skippedEntries = collectSkippedEntries(manifest);

  await mkdir(reviewDir, { recursive: true });

  const generatedAt = new Date().toISOString();
  const indexHtml = renderHtml({
    generatedAt,
    liveCaptures,
    manualCaptures,
    skippedEntries
  });
  const report = renderReport({
    generatedAt,
    liveCaptures,
    manualCaptures,
    skippedEntries
  });

  await writeFile(path.join(reviewDir, "index.html"), indexHtml, "utf8");
  await writeFile(path.join(reviewDir, "review-report.md"), report, "utf8");

  console.log(
    JSON.stringify(
      {
        liveCaptures: liveCaptures.length,
        manualReferences: manualCaptures.length,
        skippedEntries: skippedEntries.length,
        wrote: [
          "reference/fashionnova/_review/index.html",
          "reference/fashionnova/_review/review-report.md"
        ]
      },
      null,
      2
    )
  );
}

async function collectLiveCaptures(allFiles) {
  const screenshotPaths = allFiles
    .map(toRepoPath)
    .filter((filePath) => /^screenshot.*\.png$/i.test(path.posix.basename(filePath)))
    .sort((a, b) => a.localeCompare(b));
  const metadataPaths = allFiles
    .map(toRepoPath)
    .filter((filePath) => /(^metadata\.json$|\.metadata\.json$)/i.test(path.posix.basename(filePath)))
    .sort((a, b) => a.localeCompare(b));

  const metadataByScreenshot = new Map();
  for (const metadataPath of metadataPaths) {
    const metadata = JSON.parse(await readFile(path.join(repoRoot, metadataPath), "utf8"));
    for (const capture of metadata.captures ?? []) {
      const screenshotPath = normalizePath(capture.screenshotPath);
      metadataByScreenshot.set(screenshotPath, {
        id: metadata.id ?? inferIdFromPath(screenshotPath),
        viewport: capture.viewportLabel ?? inferViewport(screenshotPath),
        viewportSize: capture.viewport ?? null,
        captureMode: metadata.captureMode ?? "unknown",
        screenshotPath,
        rawDomPath: normalizePath(capture.rawDomPath),
        cleanedDomPath: normalizePath(capture.cleanedDomPath),
        metadataPath,
        boundingBox: capture.boundingBox ?? null,
        outerHTMLLength: capture.outerHTMLLength ?? null,
        sourceType: "live-extractor-output"
      });
    }
  }

  return screenshotPaths
    .map((screenshotPath) => {
      if (metadataByScreenshot.has(screenshotPath)) {
        return metadataByScreenshot.get(screenshotPath);
      }

      return {
        id: inferIdFromPath(screenshotPath),
        viewport: inferViewport(screenshotPath),
        viewportSize: null,
        captureMode: "unknown",
        screenshotPath,
        rawDomPath: "",
        cleanedDomPath: "",
        metadataPath: "",
        boundingBox: null,
        outerHTMLLength: null,
        sourceType: "live-extractor-output"
      };
    })
    .sort(compareCaptures);
}

async function collectManualCaptures(allFiles) {
  const manualFiles = allFiles
    .map(toRepoPath)
    .filter((filePath) => filePath.startsWith("reference/fashionnova/_manual/"));

  const rawFiles = manualFiles.filter((filePath) => /\.manual\.raw\.html$/i.test(filePath));
  const manualCaptures = [];

  for (const rawDomPath of rawFiles) {
    const folder = path.posix.dirname(rawDomPath);
    const cleanDomPath = rawDomPath.replace(/\.manual\.raw\.html$/i, ".manual.cleaned.html");
    const notesPath = path.posix.join(folder, "notes.md");
    const screenshotPath = findManualScreenshot(manualFiles, folder);
    const rawStats = await stat(path.join(repoRoot, rawDomPath));
    const notes = existsSync(path.join(repoRoot, notesPath))
      ? await readFile(path.join(repoRoot, notesPath), "utf8")
      : "";

    manualCaptures.push({
      id: inferManualId(rawDomPath),
      viewport: inferViewport(rawDomPath),
      viewportSize: null,
      captureMode: "manualDom",
      screenshotPath,
      rawDomPath,
      cleanedDomPath: existsSync(path.join(repoRoot, cleanDomPath)) ? cleanDomPath : "",
      metadataPath: "",
      notesPath: existsSync(path.join(repoRoot, notesPath)) ? notesPath : "",
      boundingBox: null,
      outerHTMLLength: rawStats.size,
      sourceType: "manual-reference",
      flags: [
        "manual-reference",
        "not-live-extractor-output",
        screenshotPath ? "screenshot-backed" : "not screenshot-backed"
      ],
      notes
    });
  }

  return manualCaptures.sort(compareCaptures);
}

function collectSkippedEntries(manifest) {
  return manifest.entries
    .filter((entry) => entry.status === "needs-selector")
    .map((entry) => ({
      id: entry.id,
      viewports: entry.viewports ?? [],
      captureMode: entry.captureMode ?? "element",
      outputFolder: entry.outputFolder ?? "",
      reason: entry.skipReason ?? "No skip reason recorded."
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function renderHtml({ generatedAt, liveCaptures, manualCaptures, skippedEntries }) {
  const cards = [
    ...liveCaptures.map((capture, index) => renderCard(capture, `live-${index}`)),
    ...manualCaptures.map((capture, index) => renderCard(capture, `manual-${index}`))
  ].join("\n");
  const skippedRows = skippedEntries.map(renderSkippedRow).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fashion Nova Reference Review</title>
  <style>
    :root { color-scheme: light; --bg: #f7f5f2; --panel: #fff; --text: #151515; --muted: #665f59; --line: #ded8d1; --accent: #9f1d16; --chip: #f0ebe5; --manual: #f5efe0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: var(--bg); color: var(--text); line-height: 1.45; }
    .page-header { padding: 32px clamp(18px, 4vw, 48px) 18px; border-bottom: 1px solid var(--line); background: #fff; }
    h1 { margin: 0 0 8px; font-size: clamp(28px, 5vw, 48px); letter-spacing: 0; }
    .intro { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
    .summary { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 0; padding: 0; list-style: none; }
    .summary li, .badge { border: 1px solid var(--line); border-radius: 999px; background: var(--chip); padding: 6px 10px; color: var(--muted); font-size: 13px; white-space: nowrap; }
    main { padding: 24px clamp(18px, 4vw, 48px) 48px; }
    .section-title { margin: 34px 0 12px; font-size: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 18px; }
    .card { display: flex; flex-direction: column; gap: 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); padding: 14px; min-width: 0; }
    .card.manual { background: var(--manual); }
    .card-header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
    h2 { margin: 0; font-size: 18px; letter-spacing: 0; overflow-wrap: anywhere; }
    .card-header p, .note { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
    .thumb { display: block; border: 1px solid var(--line); border-radius: 6px; background: #fafafa; overflow: hidden; }
    .thumb img { display: block; width: 100%; height: 320px; object-fit: contain; background: #fff; }
    .no-shot { display: grid; place-items: center; min-height: 180px; border: 1px dashed var(--line); border-radius: 6px; color: var(--muted); background: #fff; text-align: center; padding: 18px; }
    dl { display: grid; gap: 8px; margin: 0; font-size: 13px; }
    dl div { display: grid; grid-template-columns: 128px minmax(0, 1fr); gap: 10px; align-items: start; }
    dt { color: var(--muted); font-weight: 700; }
    dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
    code { font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 12px; }
    a { color: var(--accent); }
    .missing { color: var(--accent); font-weight: 700; }
    .status { display: flex; flex-wrap: wrap; gap: 10px 14px; margin: auto 0 0; padding: 10px; border: 1px dashed var(--line); border-radius: 6px; }
    .status legend { padding: 0 4px; color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .status label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; white-space: nowrap; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; background: #fff; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; font-size: 13px; }
    th, td { padding: 10px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { background: #f0ebe5; color: #3a332e; font-size: 12px; text-transform: uppercase; letter-spacing: 0; }
    tr:last-child td { border-bottom: 0; }
    @media (max-width: 520px) { dl div { grid-template-columns: 1fr; gap: 2px; } .thumb img { height: 260px; } .status { display: grid; } }
  </style>
</head>
<body>
  <header class="page-header">
    <h1>Fashion Nova Reference Review</h1>
    <p class="intro">Generated ${html(generatedAt)}. Use this page for visual approval only; no capture is pre-approved.</p>
    <ul class="summary">
      <li>${liveCaptures.length} live screenshot captures</li>
      <li>${manualCaptures.length} manual DOM references</li>
      <li>${skippedEntries.length} skipped entries</li>
      <li>Manual references are labeled not-live-extractor-output</li>
    </ul>
  </header>
  <main>
    <section aria-labelledby="captures-title">
      <h2 id="captures-title" class="section-title">Review Items</h2>
      <div class="grid">${cards}
      </div>
    </section>
    <section aria-labelledby="skipped-title">
      <h2 id="skipped-title" class="section-title">Skipped Entries</h2>
      <p class="intro">Reasons are taken from the extractor manifest. These entries were not captured by live extraction.</p>
      <div class="table-wrap"><table><thead><tr><th>Component</th><th>Viewports</th><th>Mode</th><th>Output folder</th><th>Reason</th></tr></thead><tbody>${skippedRows}
      </tbody></table></div>
    </section>
  </main>
</body>
</html>
`;
}

function renderCard(capture, index) {
  const viewportText = capture.viewportSize
    ? `${capture.viewport} (${capture.viewportSize.width}x${capture.viewportSize.height})`
    : capture.viewport;
  const screenshot = capture.screenshotPath
    ? `<a class="thumb" href="${html(fromReview(capture.screenshotPath))}"><img src="${html(fromReview(capture.screenshotPath))}" alt="${html(capture.id)} ${html(capture.viewport)} screenshot"></a>`
    : '<div class="no-shot">No screenshot installed<br>DOM-only manual reference</div>';
  const rawDom = linkOrMissing(capture.rawDomPath);
  const cleanDom = linkOrMissing(capture.cleanedDomPath);
  const metadata = linkOrMissing(capture.metadataPath);
  const notes = linkOrMissing(capture.notesPath);
  const bbox = capture.boundingBox
    ? `${round(capture.boundingBox.width)} x ${round(capture.boundingBox.height)}`
    : "";
  const flags = capture.flags?.length
    ? `<p class="note"><strong>Flags:</strong> ${html(capture.flags.join(", "))}</p>`
    : "";

  return `
      <article class="card ${capture.sourceType === "manual-reference" ? "manual" : "live"}">
        <header class="card-header">
          <div>
            <h2>${html(capture.id)}</h2>
            <p>${html(viewportText)} - ${html(capture.captureMode)} - ${html(capture.sourceType)}</p>
          </div>
          <span class="badge">unreviewed</span>
        </header>
        ${screenshot}
        ${flags}
        <dl>
          <div><dt>Component</dt><dd><code>${html(capture.id)}</code></dd></div>
          <div><dt>Viewport</dt><dd><code>${html(viewportText)}</code></dd></div>
          <div><dt>Source</dt><dd><code>${html(capture.sourceType)}</code></dd></div>
          <div><dt>Capture mode</dt><dd><code>${html(capture.captureMode)}</code></dd></div>
          <div><dt>Screenshot</dt><dd>${capture.screenshotPath ? `<code>${html(capture.screenshotPath)}</code>` : '<span class="missing">not screenshot-backed</span>'}</dd></div>
          <div><dt>Raw DOM</dt><dd>${rawDom}</dd></div>
          <div><dt>Cleaned DOM</dt><dd>${cleanDom}</dd></div>
          <div><dt>Metadata</dt><dd>${metadata}</dd></div>
          <div><dt>Notes</dt><dd>${notes}</dd></div>
          ${bbox ? `<div><dt>Bounding box</dt><dd><code>${html(bbox)}</code></dd></div>` : ""}
          ${capture.outerHTMLLength ? `<div><dt>DOM length</dt><dd><code>${html(capture.outerHTMLLength)}</code></dd></div>` : ""}
        </dl>
        <fieldset class="status" aria-label="Review status for ${html(capture.id)} ${html(capture.viewport)}">
          <legend>Status placeholder</legend>
          <label><input type="radio" name="review-${html(index)}" value="approved"> approved</label>
          <label><input type="radio" name="review-${html(index)}" value="rejected"> rejected</label>
          <label><input type="radio" name="review-${html(index)}" value="needs-recapture"> needs recapture</label>
        </fieldset>
      </article>`;
}

function renderReport({ generatedAt, liveCaptures, manualCaptures, skippedEntries }) {
  const liveRows = liveCaptures.map(renderReportRow).join("\n");
  const manualRows = manualCaptures.map(renderReportRow).join("\n");
  const skippedRows = skippedEntries
    .map(
      (entry) =>
        `| ${md(entry.id)} | ${md(entry.viewports.join(", "))} | ${md(entry.captureMode)} | \`${md(entry.outputFolder)}\` | ${md(entry.reason)} |`
    )
    .join("\n");

  return `# Fashion Nova Reference Review Report

Generated: ${generatedAt}

No captures are approved by this report. Manual references are DOM-only unless a screenshot is explicitly listed.

## Summary

- Live screenshot captures found: ${liveCaptures.length}
- Manual DOM references found: ${manualCaptures.length}
- Skipped manifest entries: ${skippedEntries.length}
- Review index: \`reference/fashionnova/_review/index.html\`

## Live Extractor Captures

| Component | Viewport | Mode | Screenshot | Raw DOM | Cleaned DOM | Metadata | Review status |
|-----------|----------|------|------------|---------|-------------|----------|---------------|
${liveRows}

## Manual References

Manual references are labeled \`manual-reference\`, \`not-live-extractor-output\`, and \`not screenshot-backed\` unless a screenshot file exists.

| Component | Viewport | Mode | Screenshot | Raw DOM | Cleaned DOM | Metadata | Review status |
|-----------|----------|------|------------|---------|-------------|----------|---------------|
${manualRows}

## Skipped Entries

| Component | Viewports | Mode | Output folder | Reason |
|-----------|-----------|------|---------------|--------|
${skippedRows}
`;
}

function renderReportRow(capture) {
  const viewportText = capture.viewportSize
    ? `${capture.viewport} ${capture.viewportSize.width}x${capture.viewportSize.height}`
    : capture.viewport;
  return `| ${md(capture.id)} | ${md(viewportText)} | ${md(capture.captureMode)} | ${capture.screenshotPath ? `\`${md(capture.screenshotPath)}\`` : "not screenshot-backed"} | ${capture.rawDomPath ? `\`${md(capture.rawDomPath)}\`` : "not found"} | ${capture.cleanedDomPath ? `\`${md(capture.cleanedDomPath)}\`` : "not found"} | ${capture.metadataPath ? `\`${md(capture.metadataPath)}\`` : "not applicable"} | unreviewed |`;
}

function renderSkippedRow(entry) {
  return `
        <tr><td><code>${html(entry.id)}</code></td><td>${html(entry.viewports.join(", "))}</td><td>${html(entry.captureMode)}</td><td><code>${html(entry.outputFolder)}</code></td><td>${html(entry.reason)}</td></tr>`;
}

function linkOrMissing(repoPath) {
  if (!repoPath) {
    return '<span class="missing">not applicable</span>';
  }
  if (!existsSync(path.join(repoRoot, repoPath))) {
    return '<span class="missing">not found</span>';
  }
  return `<a href="${html(fromReview(repoPath))}"><code>${html(repoPath)}</code></a>`;
}

async function walk(directory) {
  if (!existsSync(directory)) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function findManualScreenshot(manualFiles, folder) {
  return (
    manualFiles.find(
      (filePath) =>
        path.posix.dirname(filePath) === folder &&
        /^screenshot.*\.(png|jpg|jpeg|webp)$/i.test(path.posix.basename(filePath))
    ) ?? ""
  );
}

function inferIdFromPath(repoPath) {
  const normalized = normalizePath(repoPath);
  const parts = normalized.split("/");
  const fashionIndex = parts.indexOf("fashionnova");
  return parts
    .slice(fashionIndex + 1, -1)
    .filter((part) => !part.startsWith("_"))
    .join("-");
}

function inferManualId(repoPath) {
  const folderId = inferIdFromPath(repoPath).replace(/^pages-/, "");
  const fileStem = path.posix
    .basename(repoPath)
    .replace(/^dom-/, "")
    .replace(/\.(mobile|desktop)\.manual\.raw\.html$/i, "");
  const manualIdByFileStem = new Map([
    ["search-idle", "overlays-search-idle"],
    ["search-results", "overlays-search-results"],
    ["forgot-password", "overlays-sign-in-forgot-password"],
    ["wishlist-full", "wishlist-full-page"],
    ["checkout-full", "checkout-full-page"],
    ["category-strip", "product-archive-category-strip"],
    ["filter-selected", "product-archive-filter-selected"],
    ["dashboard", "my-account-dashboard"],
    ["orders", "my-account-orders"],
    ["my-info", "my-account-my-info"]
  ]);

  return manualIdByFileStem.get(fileStem) ?? folderId;
}

function inferViewport(repoPath) {
  const base = path.posix.basename(repoPath).toLowerCase();
  if (base.includes("mobile")) {
    return "mobile";
  }
  if (base.includes("desktop")) {
    return "desktop";
  }
  return "unknown";
}

function compareCaptures(a, b) {
  return `${a.id}-${a.viewport}-${a.rawDomPath || a.screenshotPath}`.localeCompare(
    `${b.id}-${b.viewport}-${b.rawDomPath || b.screenshotPath}`
  );
}

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function normalizePath(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function fromReview(repoPath) {
  return path.relative(reviewDir, path.join(repoRoot, repoPath)).replaceAll(path.sep, "/");
}

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function md(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function round(value) {
  return Math.round(value * 100) / 100;
}
