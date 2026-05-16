# CODEX WORKFLOW

## Session Types

Every Codex interaction is one of seven types. Never mix them.

### REFERENCE
Organize raw Fashion Nova reference files. Copy rendered HTML, save screenshots.
May create or edit files only inside `reference/fashionnova/`.
No production code. No specs. No cleaning.

```
Profile: work (writes to reference/ only)
Output: dom.raw.html, screenshot-mobile.png, screenshot-active.png, notes.md
```

### SPEC
Convert raw reference into clean implementation specs.
Codex reads the raw HTML + global Fashion Nova CSS and extracts the relevant rules, measurements, and behavior.

```
Profile: work (writes to reference/ and docs/ only)
Output: dom.cleaned.html, used-rules.css, computed-critical.json, component-spec.md, acceptance.md
Rule: No production code. Reference normalization only.
```

### PLAN
Read-only. No code changes. Codex analyzes reference specs and produces an implementation plan.

```
Profile: plan (read-only, on-request approval)
Output: docs/plan-[component].md
Rule: Do not create or modify any code files.
```

### BUILD
One branch. One component. Codex writes code. Scoped to specific files.

```
Profile: work (workspace-write, on-failure approval)
Output: PHP templates, CSS, JS files
Rule: Do not modify unrelated files. Do not refactor previous work.
```

### FIX
Visual mismatch only. Spacing, font size, color, padding — CSS/HTML adjustments.
Not for broken functionality.

```
Profile: work
Output: Targeted CSS/HTML changes
Rule: Fix only the listed visual issues. Do not refactor. Do not touch PHP logic.
```

### REVIEW
Fresh session. Read-only. Codex reviews build output against reference specs and acceptance criteria.

```
Profile: plan (read-only)
Output: Review report with issues found
Rule: Do not modify any files. Report only.
```

### DEBUG
Separate from build. Investigates a specific functional bug — console errors, PHP warnings, AJAX failures, broken WooCommerce behavior. Produces a minimal targeted fix.

```
Profile: work
Output: Minimal fix to specific files
Rule: Fix only the reported bug. Do not refactor. Do not improve.
```

### FIX vs DEBUG
- **FIX** = visual mismatch (spacing off, font wrong, color incorrect, element misaligned)
- **DEBUG** = functional error (console error, PHP warning, AJAX failure, cart broken, payment broken)

Do not use DEBUG for visual issues. Do not use FIX for broken functionality.

---

## Codex Config

```toml
# ~/.codex/config.toml

model = "gpt-5-codex"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
history.persistence = "save-all"

[profiles.plan]
approval_policy = "on-request"
sandbox_mode = "read-only"
model_reasoning_effort = "high"

[profiles.work]
approval_policy = "on-failure"
sandbox_mode = "workspace-write"
model_reasoning_effort = "high"

[profiles.review]
approval_policy = "on-request"
sandbox_mode = "read-only"
model_reasoning_effort = "high"
```

Start with `plan` profile for PLAN/REVIEW sessions. Use `work` for REFERENCE/SPEC/BUILD/FIX/DEBUG.

---

## Orchestrator Model: Side Chat

The Codex side chat is the orchestrator. The main chat is the worker.

### How It Works

```
SIDE CHAT (right panel) = orchestrator
    Reads AGENTS.md, TASK_BOARD.md, BUILD_LOG.md, DECISIONS.md
    Sees the main chat context
    Decides what to do next
    Writes the exact prompt for the main chat
    Reviews results
    Does NOT modify files

MAIN CHAT (left panel) = worker
    Executes the prompt pasted from the side chat
    Writes code, modifies files
    Updates BUILD_LOG.md and TASK_BOARD.md
```

### The Loop

1. Side chat → "Read TASK_BOARD.md and BUILD_LOG.md. What's the next task? Write the exact prompt."
2. Side chat outputs the prompt
3. You paste that prompt into the main chat
4. Main chat executes, writes code
5. You visually check the output (Chrome, 390px)
6. You git commit and push
7. Side chat → "Session done. Files changed: [list]. Visual check: pass/fail. What's next?"
8. Repeat

### When to Start Fresh

When the main chat gets long or context degrades:
- Start a new main chat in the same project
- Open a new side chat
- First message to side chat: "Read TASK_BOARD.md and BUILD_LOG.md. Where are we?"
- Side chat picks up from the repo state, not from old chat history

---

## Session Naming Convention

```
REF-12-product-card
SPEC-12-product-card
PLAN-12-product-card-static
BUILD-12-product-card-static
FIX-12-product-card-spacing-01
REVIEW-12-product-card-static
BUILD-12-product-card-wc
REVIEW-12-product-card-wc
DEBUG-BUG-001-product-card-heart
```

## Branch Naming

```
ref/12-product-card
spec/12-product-card
prototype/12-product-card
feature/12-product-card-wc
fix/12-product-card-spacing
fix/bug-001-product-card-heart
```

One branch per task. Never reuse branches across components.

---

## Component Build Pipeline

For each component, sessions run in this order:

```
1. REFERENCE session  → raw extraction (dom.raw.html + screenshots)
2. SPEC session       → normalized spec (used-rules.css, component-spec.md, acceptance.md)
3. PLAN session       → implementation plan (optional for simple components)
4. BUILD session      → static prototype (HTML/CSS, fake data)
5. Visual check       → YOU compare against screenshot (not a Codex session)
6. FIX session(s)     → if prototype doesn't match (may need multiple)
7. REVIEW session     → Codex reviews static prototype (optional, recommended for complex)
8. BUILD session      → WooCommerce integration (real data)
9. Staging test       → YOU verify on staging (not a Codex session)
10. REVIEW session    → Codex reviews integrated code (recommended for complex)
11. DEBUG session(s)  → only if functional bugs found
```

Steps 5 and 9 are you, not Codex. Do not skip them.

---

## Session Prompt Structure

```
SESSION TYPE: [Reference / Spec / Plan / Build / Fix / Review / Debug]
COMPONENT: [name]
BRANCH: [branch name]

CONTEXT:
- Read BUILD_LOG.md and TASK_BOARD.md for current state
- Read DECISIONS.md for prior choices
- [Any specific files to read first]

REFERENCE:
- reference/fashionnova/[component]/dom.raw.html
- reference/fashionnova/[component]/screenshot-mobile.png
- reference/fashionnova/_global/fashionnova.raw.css

TASK:
[Clear, scoped description]

FILES TO CREATE/MODIFY:
[Explicit list]

DO NOT:
- [Component-specific restrictions]

DONE WHEN:
- [Specific acceptance criteria]
```

Keep prompts short. Codex reads AGENTS.md automatically. Only add constraints specific to this session.

---

## Context Management

Codex has no memory between sessions. Repo files ARE the memory.

### BUILD_LOG.md
Update after every session. Codex reads it at the start of every new session.

### DECISIONS.md
Log every architectural or design decision. Codex reads this to avoid contradicting previous choices.

### TASK_BOARD.md
Active sessions, file locks, current phase, next tasks, blocked tasks. The orchestrator's control panel.

### DEBUG_LOG.md
Log every functional bug with symptoms, reproduction, and resolution.

---

## When to Stay vs Start New Chat

**Stay in same main chat when:**
- Same component, same branch, same files, same objective
- Tiny CSS/spacing/HTML adjustment
- No new bug category
- Codex has edited fewer than 3 files

**Start a new main chat when:**
- New component
- New branch
- PHP involved after CSS-only work
- WooCommerce integration after static prototype
- Error found after local testing
- Bug affects more than one file
- Codex has already edited 3+ files
- Codex output starts contradicting itself

Always open a fresh side chat with the new main chat.

---

## Parallel Work Rules

**Safe to parallelize (different files):**
- Two components on different pages
- CSS-only restyle + a new template on another page
- Footer + account page

**Unsafe to parallelize (same files):**
- Two components that both modify functions.php
- Two components that share a CSS file
- Anything touching the same template

When parallelizing, add to each prompt:
```
NOTE: Another session is working on [component].
It may modify [file]. Do not touch that file.
```

---

## Fix Session Format

```
SESSION TYPE: FIX
COMPONENT: [name]

ISSUES:
1. [Element] — expected [exact value], got [exact value]
2. [Element] — [specific visual mismatch vs reference]
3. [Element] — [exact correction needed]

Fix ONLY these CSS/HTML issues.
Do not refactor. Do not reorganize. Do not touch PHP.
Do not modify unrelated files.
```

## Debug Session Format

```
SESSION TYPE: DEBUG
BUG ID: BUG-[number]
COMPONENT: [name]

SYMPTOM:
[What's broken — exact error, behavior, or failure]

EXPECTED:
[What should happen]

ACTUAL:
[What actually happens]

CONSOLE/PHP ERRORS:
[Paste exact errors if any]

TASK:
Identify root cause. Implement minimal fix.

CONSTRAINTS:
- Do not refactor
- Do not modify unrelated files
- Update DEBUG_LOG.md and BUILD_LOG.md

DONE WHEN:
- [Specific verification of the fix]
```

---

## Reference Status Tracking

Once a component reference is complete and approved, freeze it:

```
reference/fashionnova/12-product-card/status.md
Status: Frozen
Date: YYYY-MM-DD
Notes: Approved for prototype build
```

Only reopen if a major mismatch is discovered during integration.

---

## Rollback Protocol

Before merging integration work:
- Commit reference/spec/prototype separately from integration
- Tag stable staging checkpoints
- Never batch checkout + cart + account changes together

Rollback:
```powershell
git revert [commit]
# clear WP Rocket cache on staging
# retest staging
```

---

## Progressive Complexity

**Start simple:**
- Codex Desktop App
- One main chat + one side chat at a time
- Manual review after each session
- Reference then Spec then Build then Check then Fix cycle

**After comfortable:**
- Parallel sessions on independent components
- Skip PLAN sessions for simple components
- Use REVIEW sessions only for complex integrations

**Only if manual orchestration becomes painful:**
- Consider oh-my-codex (OMX) for multi-agent coordination
- Consider git worktrees for parallel branch isolation

---

## Pre-Flight Checklist

**Before every build session:**
- [ ] Reference files exist for this component
- [ ] Spec is normalized (used-rules.css, component-spec.md, acceptance.md)
- [ ] BUILD_LOG.md is current
- [ ] TASK_BOARD.md shows this task as active with file locks
- [ ] Previous component is merged and tested
- [ ] Dependencies are clear

**After every session:**
- [ ] Review the diff
- [ ] Test at 390px and 1440px in Chrome DevTools
- [ ] Compare against reference screenshot
- [ ] Check for console errors
- [ ] Update BUILD_LOG.md
- [ ] Update TASK_BOARD.md
- [ ] Commit and push
