import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const defaultManifestPath = path.join(__dirname, "manifest.json");

const VIEWPORTS = {
  mobile: { label: "mobile", width: 390, height: 844 },
  desktop: { label: "desktop", width: 1440, height: 1000 }
};

const SKIPPED_STATUS = "needs-selector";
const VALID_CAPTURE_MODES = new Set(["element", "fullPage"]);
const DEFAULT_MIN_ELEMENT_SIZE = 50;
const REMOVABLE_SELECTOR =
  'link[rel="modulepreload"], script, style, noscript, template';

const args = parseArgs(process.argv.slice(2));
const manifestPath = args.manifest
  ? path.resolve(process.cwd(), args.manifest)
  : defaultManifestPath;

main().catch((error) => {
  console.error(`\nReference extraction failed: ${error.message}`);
  if (args.debug && error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
});

async function main() {
  const manifest = await loadManifest(manifestPath);
  const validation = validateManifest(manifest);

  if (args.list) {
    listEntries(validation.entries);
    return;
  }

  if (args.validate) {
    printValidationSummary(validation);
    return;
  }

  const selectedEntries = selectEntries(validation.entries, args);
  const runnableEntries = selectedEntries.filter(
    (entry) => entry.status !== SKIPPED_STATUS
  );
  const skippedEntries = selectedEntries.filter(
    (entry) => entry.status === SKIPPED_STATUS
  );

  if (skippedEntries.length > 0) {
    printSkippedSummary(skippedEntries);
  }

  if (runnableEntries.length === 0) {
    console.log("\nNo runnable manifest entries selected.");
    return;
  }

  const browser = await chromium.launch({
    headless: !args.headed
  });

  try {
    for (const entry of runnableEntries) {
      await extractEntry(browser, entry);
    }
  } finally {
    await browser.close();
  }
}

async function extractEntry(browser, entry) {
  const outputFolder = path.resolve(repoRoot, entry.outputFolder);
  const metadataPath = path.join(outputFolder, entry.outputs.metadata);
  const viewportLabels = entry.viewports;
  const actionsRun = [];
  const captures = [];

  await mkdir(outputFolder, { recursive: true });

  console.log(`\nExtracting ${entry.id}`);
  console.log(`Opening ${entry.url}`);

  for (const viewportLabel of viewportLabels) {
    const viewport = VIEWPORTS[viewportLabel];
    const rawDomPath = getDomPath(entry, outputFolder, "rawDom", viewportLabel);
    const cleanDomPath = getDomPath(entry, outputFolder, "cleanDom", viewportLabel);
    const screenshotPath = getScreenshotPath(entry, outputFolder, viewportLabel);
    const page = await browser.newPage({
      viewport: {
        width: viewport.width,
        height: viewport.height
      }
    });

    try {
      await page.goto(entry.url, {
        waitUntil: "domcontentloaded",
        timeout: 60_000
      });

      await waitForPageReady(page, entry);
      await dismissTransientOverlays(page);
      const viewportActions = await runActions(page, entry.actions);
      actionsRun.push(
        ...viewportActions.map((action) => ({
          ...action,
          viewport: viewportLabel
        }))
      );

      const capture = entry.captureMode === "fullPage"
        ? await captureFullPage(page, screenshotPath)
        : await captureElement(page, entry, screenshotPath);

      if (capture.rawDom.length <= 100) {
        throw extractionError(
          entry,
          `Captured ${viewportLabel} raw DOM is too short: ${capture.rawDom.length} characters.`
        );
      }

      await writeFile(rawDomPath, `${capture.rawDom}\n`, "utf8");
      await writeFile(cleanDomPath, `${capture.cleanDom}\n`, "utf8");

      captures.push({
        viewportLabel,
        viewport: {
          width: viewport.width,
          height: viewport.height
        },
        url: page.url(),
        rawDomPath: toRepoPath(rawDomPath),
        cleanedDomPath: toRepoPath(cleanDomPath),
        screenshotPath: toRepoPath(screenshotPath),
        boundingBox: capture.boundingBox,
        outerHTMLLength: capture.rawDom.length
      });

      console.log(`Saved ${viewportLabel} raw DOM: ${toRepoPath(rawDomPath)}`);
      console.log(`Saved ${viewportLabel} cleaned DOM: ${toRepoPath(cleanDomPath)}`);
      console.log(
        `Saved ${viewportLabel} screenshot: ${toRepoPath(screenshotPath)}`
      );
    } finally {
      await page.close();
    }
  }

  const firstCapture = captures[0];
  const metadata = {
    id: entry.id,
    url: firstCapture?.url ?? entry.url,
    requestedUrl: entry.url,
    selector: entry.target || null,
    captureMode: entry.captureMode,
    timestamp: new Date().toISOString(),
    actionsRun,
    captures
  };

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");

  console.log(`Saved metadata: ${toRepoPath(metadataPath)}`);
}

async function captureElement(page, entry, screenshotPath) {
  const locator = page.locator(entry.target);
  const count = await locator.count();

  if (count !== 1) {
    throw extractionError(
      entry,
      `Target selector must match exactly 1 element; found ${count}.`
    );
  }

  if (!(await locator.isVisible())) {
    throw extractionError(entry, "Target selector matched an invisible element.");
  }

  const box = await waitForStableBoundingBox(page, locator, entry);
  await waitForImages(locator);

  const minWidth = entry.validation.minWidth;
  const minHeight = entry.validation.minHeight;

  if (box.width <= minWidth || box.height <= minHeight) {
    throw extractionError(
      entry,
      `Target element is too small: ${box.width}x${box.height}; minimum is ${minWidth}x${minHeight}.`
    );
  }

  const rawDom = await locator.evaluate((element) => element.outerHTML);
  if (!rawDom || rawDom.length <= 100) {
    throw extractionError(
      entry,
      `Target outerHTML is too short: ${rawDom?.length ?? 0} characters.`
    );
  }

  const cleanDom = await locator.evaluate((element, removableSelector) => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll(removableSelector).forEach((node) => node.remove());
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }
    comments.forEach((comment) => comment.remove());
    return clone.outerHTML;
  }, REMOVABLE_SELECTOR);

  await locator.screenshot({ path: screenshotPath });

  return {
    rawDom,
    cleanDom,
    boundingBox: normalizeBox(box)
  };
}

async function captureFullPage(page, screenshotPath) {
  await waitForImages(page.locator("body"));

  const rawDom = await page.evaluate(() => document.body.outerHTML);
  const cleanDom = await page.evaluate((removableSelector) => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll(removableSelector).forEach((node) => node.remove());
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const comments = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode);
    }
    comments.forEach((comment) => comment.remove());
    return clone.outerHTML;
  }, REMOVABLE_SELECTOR);

  await page.screenshot({
    fullPage: true,
    path: screenshotPath
  });

  return {
    rawDom,
    cleanDom,
    boundingBox: null
  };
}

async function waitForStableBoundingBox(page, locator, entry) {
  let previousBox = null;
  let stableSamples = 0;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const box = await locator.boundingBox();
    if (!box) {
      await page.waitForTimeout(250);
      continue;
    }

    if (boxesAreClose(previousBox, box)) {
      stableSamples += 1;
    } else {
      stableSamples = 0;
    }

    if (stableSamples >= 2) {
      return box;
    }

    previousBox = box;
    await page.waitForTimeout(250);
  }

  const finalBox = await locator.boundingBox();
  if (!finalBox) {
    throw extractionError(entry, "Target selector has no bounding box.");
  }

  return finalBox;
}

async function waitForImages(locator) {
  await locator.evaluate(async (element) => {
    const images = [...element.querySelectorAll("img")];
    if (images.length === 0) {
      return;
    }

    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            const timeout = window.setTimeout(resolve, 5000);
            const settle = () => {
              window.clearTimeout(timeout);
              resolve();
            };
            image.addEventListener("load", settle, { once: true });
            image.addEventListener("error", settle, { once: true });
          })
      )
    );
  });
}

async function waitForPageReady(page, entry) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 20_000 });
    return;
  } catch {
    console.warn("Network did not become idle within 20s; waiting for visible content.");
  }

  if (entry.captureMode === "element") {
    await page.locator(entry.target).waitFor({
      state: "visible",
      timeout: 40_000
    });
    return;
  }

  await page.locator("body").waitFor({
    state: "visible",
    timeout: 40_000
  });
}

async function dismissTransientOverlays(page) {
  const closeLocators = [
    page.locator('[data-testid="close-modal"]'),
    page.locator('[data-testid="modal-container"] button:has-text("Continue")'),
    page.getByRole("button", { name: "close dialog" }),
    page.getByRole("button", { name: "Close Modal" }),
    page.getByRole("button", { name: "Close" }),
    page.getByRole("button", { name: "I will pay full price" }),
    page.getByRole("button", { name: "I Will Pay Full Price!" }),
    page.getByLabel("close dialog")
  ];

  for (const closeLocator of closeLocators) {
    const count = await closeLocator.count().catch(() => 0);
    if (count === 0) {
      continue;
    }

    let visibleLocator = null;
    for (let index = 0; index < count; index += 1) {
      const candidate = closeLocator.nth(index);
      const visible = await candidate.isVisible().catch(() => false);
      if (visible) {
        visibleLocator = candidate;
        break;
      }
    }

    if (!visibleLocator) {
      continue;
    }

    await visibleLocator.click({ timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function runActions(page, actions = []) {
  const actionsRun = [];

  for (const action of actions) {
    if (action.type === "click") {
      await page.locator(action.selector).click({ timeout: action.timeout ?? 10_000 });
    } else if (action.type === "fill") {
      await page.locator(action.selector).fill(action.value, {
        timeout: action.timeout ?? 10_000
      });
    } else if (action.type === "wait") {
      await page.waitForTimeout(action.ms);
    } else if (action.type === "waitForSelector") {
      await page.locator(action.selector).waitFor({
        state: action.state ?? "visible",
        timeout: action.timeout ?? 10_000
      });
    } else if (action.type === "goto") {
      await page.goto(action.url, {
        waitUntil: action.waitUntil ?? "domcontentloaded",
        timeout: action.timeout ?? 60_000
      });
      await waitForPageReady(page, { captureMode: "fullPage" });
    } else if (action.type === "scroll") {
      await page.mouse.wheel(0, action.y);
    } else {
      throw new Error(`Unknown action type: ${action.type}`);
    }

    actionsRun.push(action);
  }

  return actionsRun;
}

async function loadManifest(filePath) {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  if (!parsed || !Array.isArray(parsed.entries)) {
    throw new Error(`Manifest must contain an "entries" array: ${filePath}`);
  }

  return parsed;
}

function validateManifest(manifest) {
  const seenIds = new Set();
  const entries = manifest.entries.map((entry, index) => {
    const normalized = normalizeEntry(entry, index);

    if (seenIds.has(normalized.id)) {
      throw new Error(`Duplicate manifest id: ${normalized.id}`);
    }

    seenIds.add(normalized.id);
    return normalized;
  });

  return { entries };
}

function normalizeEntry(entry, index) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error(`Manifest entry at index ${index} must be an object.`);
  }

  if (!isNonEmptyString(entry.id)) {
    throw new Error(`Manifest entry at index ${index} is missing a non-empty id.`);
  }

  const status = entry.status ?? "ready";
  if (status !== "ready" && status !== SKIPPED_STATUS) {
    throw new Error(
      `Manifest entry "${entry.id}" has unsupported status "${status}".`
    );
  }

  const captureMode = entry.captureMode ?? "element";
  if (!VALID_CAPTURE_MODES.has(captureMode)) {
    throw new Error(
      `Manifest entry "${entry.id}" has unsupported captureMode "${captureMode}".`
    );
  }

  const viewports = normalizeViewports(entry);
  const outputs = normalizeOutputs(entry);

  const normalized = {
    id: entry.id,
    status,
    url: entry.url ?? "",
    viewports,
    target: entry.target ?? "",
    captureMode,
    validation: normalizeValidation(entry),
    actions: normalizeActions(entry),
    outputFolder: entry.outputFolder ?? "",
    outputs
  };

  if (status !== SKIPPED_STATUS) {
    validateRunnableEntry(normalized);
  } else if (!isNonEmptyString(normalized.outputFolder)) {
    throw new Error(
      `Skipped manifest entry "${entry.id}" still needs outputFolder for planning.`
    );
  }

  return normalized;
}

function validateRunnableEntry(entry) {
  const requiredStrings = [
    ["url", entry.url],
    ["outputFolder", entry.outputFolder],
    ["outputs.rawDom", entry.outputs.rawDom],
    ["outputs.cleanDom", entry.outputs.cleanDom],
    ["outputs.metadata", entry.outputs.metadata]
  ];

  if (entry.captureMode === "element") {
    requiredStrings.push(["target", entry.target]);
  }

  for (const [name, value] of requiredStrings) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Manifest entry "${entry.id}" is missing a non-empty "${name}" value.`
      );
    }
  }

  for (const viewportLabel of entry.viewports) {
    getScreenshotName(entry, viewportLabel);
  }
}

function normalizeValidation(entry) {
  const validation = entry.validation ?? {};
  if (!validation || typeof validation !== "object" || Array.isArray(validation)) {
    throw new Error(`Manifest entry "${entry.id}" validation must be an object.`);
  }

  const minWidth = validation.minWidth ?? DEFAULT_MIN_ELEMENT_SIZE;
  const minHeight = validation.minHeight ?? DEFAULT_MIN_ELEMENT_SIZE;

  if (!isPositiveNumber(minWidth) || !isPositiveNumber(minHeight)) {
    throw new Error(
      `Manifest entry "${entry.id}" validation minWidth/minHeight must be positive numbers.`
    );
  }

  return {
    minWidth,
    minHeight
  };
}

function normalizeViewports(entry) {
  if (!Array.isArray(entry.viewports) || entry.viewports.length === 0) {
    throw new Error(`Manifest entry "${entry.id}" needs a non-empty viewports array.`);
  }

  return entry.viewports.map((viewportLabel) => {
    if (!VIEWPORTS[viewportLabel]) {
      throw new Error(
        `Manifest entry "${entry.id}" uses unknown viewport "${viewportLabel}".`
      );
    }
    return viewportLabel;
  });
}

function normalizeOutputs(entry) {
  if (!entry.outputs || typeof entry.outputs !== "object" || Array.isArray(entry.outputs)) {
    throw new Error(`Manifest entry "${entry.id}" needs an outputs object.`);
  }

  return {
    rawDom: entry.outputs.rawDom ?? "",
    cleanDom: entry.outputs.cleanDom ?? "",
    screenshotMobile: entry.outputs.screenshotMobile ?? "",
    screenshotDesktop: entry.outputs.screenshotDesktop ?? "",
    metadata: entry.outputs.metadata ?? ""
  };
}

function normalizeActions(entry) {
  if (entry.actions == null) {
    return [];
  }

  if (!Array.isArray(entry.actions)) {
    throw new Error(`Manifest entry "${entry.id}" actions must be an array.`);
  }

  return entry.actions.map((action, index) => {
    if (!action || typeof action !== "object" || Array.isArray(action)) {
      throw new Error(`Action ${index} in "${entry.id}" must be an object.`);
    }

    if (!isNonEmptyString(action.type)) {
      throw new Error(`Action ${index} in "${entry.id}" needs a type.`);
    }

    if (["click", "fill", "waitForSelector"].includes(action.type)) {
      if (!isNonEmptyString(action.selector)) {
        throw new Error(
          `Action ${index} in "${entry.id}" needs a non-empty selector.`
        );
      }
    }

    if (action.type === "goto" && !isNonEmptyString(action.url)) {
      throw new Error(`Goto action ${index} in "${entry.id}" needs a non-empty url.`);
    }

    if (action.type === "fill" && typeof action.value !== "string") {
      throw new Error(`Fill action ${index} in "${entry.id}" needs a string value.`);
    }

    if (action.type === "wait" && !isPositiveNumber(action.ms)) {
      throw new Error(`Wait action ${index} in "${entry.id}" needs positive ms.`);
    }

    if (action.type === "scroll" && typeof action.y !== "number") {
      throw new Error(`Scroll action ${index} in "${entry.id}" needs numeric y.`);
    }

    if (
      !["click", "fill", "wait", "waitForSelector", "goto", "scroll"].includes(action.type)
    ) {
      throw new Error(`Action ${index} in "${entry.id}" has unknown type.`);
    }

    return action;
  });
}

function selectEntries(entries, parsedArgs) {
  const requestedIds = new Set();

  if (parsedArgs.id) {
    requestedIds.add(parsedArgs.id);
  }

  for (const id of parsedArgs.ids) {
    requestedIds.add(id);
  }

  if (requestedIds.size === 0) {
    return entries;
  }

  const knownIds = new Set(entries.map((entry) => entry.id));
  const missingIds = [...requestedIds].filter((id) => !knownIds.has(id));
  if (missingIds.length > 0) {
    throw new Error(`Unknown manifest id(s): ${missingIds.join(", ")}`);
  }

  return entries.filter((entry) => requestedIds.has(entry.id));
}

function listEntries(entries) {
  for (const entry of entries) {
    const status = entry.status === SKIPPED_STATUS ? "needs selector" : "ready";
    console.log(`\n${entry.id} (${status})`);
    console.log(`  mode: ${entry.captureMode}`);
    console.log(`  url: ${entry.url || "(missing)"}`);
    console.log(`  output: ${entry.outputFolder}`);
    for (const viewportLabel of entry.viewports) {
      console.log(
        `  ${viewportLabel} raw DOM: ${toViewportDomName(entry.outputs.rawDom, viewportLabel)}`
      );
      console.log(
        `  ${viewportLabel} cleaned DOM: ${toViewportDomName(entry.outputs.cleanDom, viewportLabel)}`
      );
      console.log(
        `  ${viewportLabel} screenshot: ${getScreenshotName(entry, viewportLabel)}`
      );
    }
    console.log(`  metadata: ${entry.outputs.metadata}`);
  }
}

function printValidationSummary(validation) {
  const readyCount = validation.entries.filter(
    (entry) => entry.status !== SKIPPED_STATUS
  ).length;
  const skippedCount = validation.entries.length - readyCount;

  console.log(
    `Manifest valid: ${validation.entries.length} entries (${readyCount} ready, ${skippedCount} needs selector).`
  );
}

function printSkippedSummary(entries) {
  console.log("\nSkipping entries marked needs-selector:");
  for (const entry of entries) {
    console.log(`- ${entry.id}`);
  }
}

function getScreenshotPath(entry, outputFolder, viewportLabel) {
  return path.join(outputFolder, getScreenshotName(entry, viewportLabel));
}

function getDomPath(entry, outputFolder, outputKey, viewportLabel) {
  return path.join(
    outputFolder,
    toViewportDomName(entry.outputs[outputKey], viewportLabel)
  );
}

function toViewportDomName(fileName, viewportLabel) {
  if (fileName.endsWith(".raw.html")) {
    return fileName.replace(/\.raw\.html$/, `.${viewportLabel}.raw.html`);
  }

  if (fileName.endsWith(".cleaned.html")) {
    return fileName.replace(/\.cleaned\.html$/, `.${viewportLabel}.cleaned.html`);
  }

  const parsed = path.parse(fileName);
  return `${parsed.name}.${viewportLabel}${parsed.ext}`;
}

function getScreenshotName(entry, viewportLabel) {
  const key = viewportLabel === "mobile" ? "screenshotMobile" : "screenshotDesktop";
  const value = entry.outputs[key];

  if (!isNonEmptyString(value)) {
    throw new Error(
      `Manifest entry "${entry.id}" needs outputs.${key} for ${viewportLabel}.`
    );
  }

  return value;
}

function extractionError(entry, reason) {
  return new Error(
    [
      `Component: ${entry.id}`,
      `Selector: ${entry.target || "(none)"}`,
      `Reason: ${reason}`
    ].join("\n")
  );
}

function normalizeBox(box) {
  return {
    x: round(box.x),
    y: round(box.y),
    width: round(box.width),
    height: round(box.height)
  };
}

function boxesAreClose(a, b) {
  if (!a || !b) {
    return false;
  }

  return (
    Math.abs(a.x - b.x) <= 0.5 &&
    Math.abs(a.y - b.y) <= 0.5 &&
    Math.abs(a.width - b.width) <= 0.5 &&
    Math.abs(a.height - b.height) <= 0.5
  );
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function parseArgs(rawArgs) {
  const parsed = {
    debug: false,
    headed: false,
    id: "",
    ids: [],
    list: false,
    manifest: "",
    validate: false
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === "--debug") {
      parsed.debug = true;
    } else if (arg === "--headed") {
      parsed.headed = true;
    } else if (arg === "--list") {
      parsed.list = true;
    } else if (arg === "--validate") {
      parsed.validate = true;
    } else if (arg === "--id") {
      parsed.id = readArgValue(rawArgs, index, arg);
      index += 1;
    } else if (arg.startsWith("--id=")) {
      parsed.id = arg.slice("--id=".length);
    } else if (arg === "--ids") {
      parsed.ids = parseIds(readArgValue(rawArgs, index, arg));
      index += 1;
    } else if (arg.startsWith("--ids=")) {
      parsed.ids = parseIds(arg.slice("--ids=".length));
    } else if (arg === "--manifest") {
      parsed.manifest = readArgValue(rawArgs, index, arg);
      index += 1;
    } else if (arg.startsWith("--manifest=")) {
      parsed.manifest = arg.slice("--manifest=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function parseIds(value) {
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function readArgValue(rawArgs, index, name) {
  const value = rawArgs[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}
