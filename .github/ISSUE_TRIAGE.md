# Issue triage protocol

This document describes how issues on this repository are triaged. It is the canonical reference for both human maintainers and any AI assistant (e.g. Claude Code) doing a triage pass.

The repository is in **maintenance mode** (see the top of `README.md`). The bar for new code is high; the bar for closing issues that aren't actionable is low. This protocol exists so the backlog stays small and so reporters get a timely, predictable answer.

## When triage runs

There is no webhook subscription on issue events. Triage is initiated manually, typically in one of two ways:

1. **On-demand pass** — a maintainer (or Claude session) runs through every open issue, or every issue opened/updated since the last pass.
2. **Per-PR backstop** — when a PR that closes one or more issues is merged and the marketplace publish completes, the "Fixed in version" template is posted on each linked issue.

A reasonable cadence is monthly, plus an ad-hoc pass whenever a release ships.

## Step-by-step workflow

For each open issue under consideration:

1. **Read the full issue.** Body, all comments, any linked PRs.
2. **Determine the reporter's version.** Look for `NewmanPostman@4` in pasted logs, or an explicit version mention. If the report predates the current task version (see `NewmanPostman/task.json`), an upgrade nudge is appropriate before deeper investigation.
3. **Classify into one bucket** (see below).
4. **Take the bucket's action** under the authority rules below. Use the canned templates so replies stay consistent.

## Buckets

| Bucket | Meaning |
| --- | --- |
| `BUG_FIXABLE` | Task code or `task.json` is producing wrong behavior. A concrete code path (file + line) is identified. |
| `FEATURE` | New behavior; not currently in the task. |
| `DOCS` | Behavior is correct, but the reporter didn't know how to use it. README change resolves it. |
| `USER_ERROR_OR_CONFIG` | The reporter's pipeline, network, build agent, or Postman collection is at fault. The task is behaving as designed. |
| `INSUFFICIENT_INFO` | The body lacks the logs, version, or repro steps needed to classify into anything else. |
| `STALE_FIXED_UPSTREAM` | Newman or Azure DevOps has since changed and the report no longer applies, or the feature has since been added. |
| `WONT_FIX` | Out of scope. Conflicts with the maintenance-mode posture (sweeping refactors, reimplementing Newman) or is a request the task does not aim to serve. |

## Authority rules

Some actions a maintainer or Claude session should take **without asking first**. Some require a confirmation step. The split is by blast radius and reversibility.

### Auto-action (no confirmation needed)

- **Auto-close** for `STALE_FIXED_UPSTREAM`.
- **Auto-close** for clear `USER_ERROR_OR_CONFIG` (e.g., the reporter's own Postman assertion failed and `newman` exited 1 as designed).
- **Auto-close** for any `INSUFFICIENT_INFO` issue where a comment requesting repro has gone **14+ days** with no reporter response.
- **Auto-comment then wait 14 days** for any fresh `INSUFFICIENT_INFO`, or any ambiguous `USER_ERROR_OR_CONFIG`.
- **Post the "Fixed in version" template** on issues referenced by a merged-and-published fix PR.

### Confirm before acting

- **`BUG_FIXABLE`** — always confirm the fix sketch and the version-bump intent (patch/minor/major) before opening a PR.
- **`FEATURE`** — always confirm the scope, the new input shape (if any), and the version bump.
- **`WONT_FIX`** — always confirm that the issue should be publicly closed. The reply is visible to the reporter; consensus matters.
- **Any DOCS change** that touches `README.md` or `CLAUDE.md` — confirm the scope before writing the section.

## Canned reply templates

Use the closest-fitting template verbatim. Personalize only the bracketed placeholders and keep the prose short.

### `[need-repro]`

> Thanks for the report. To dig in, could you paste:
>
> 1. The full task log around the failure (the lines starting with `##[error]` and the surrounding `newman run` output).
> 2. The `Task version` shown in the log header (or the value of `NewmanPostman@<N>` in your YAML).
> 3. A minimal collection that reproduces the issue.
>
> If we don't hear back in two weeks I'll close this; please reopen any time once you have the details.

### `[fixed-in-version]`

> Fixed in extension **v[EXT_VERSION]** (task v[TASK_VERSION]) — just published to the marketplace.
>
> Pipelines on `NewmanPostman@4` will pick this up automatically on the next run. Please reopen if the issue still reproduces on the new version.

### `[already-supported]`

> This is already supported via the **`[INPUT_NAME]`** input on task v[MIN_VERSION]+. See the [README section]([LINK]) for usage.
>
> Closing — feel free to reopen if your config still hits the original bug.

### `[newman-side]`

> This error comes from Newman's HTTP client / your build agent / your collection rather than the task. [ONE-SENTENCE WHY].
>
> If it reproduces against the Newman CLI directly (outside Azure DevOps), please open an issue on the Newman repo at <https://github.com/postmanlabs/newman>. Closing here.

### `[wont-fix]`

> [ONE-SENTENCE RATIONALE].
>
> Closing as not planned. The repository is in maintenance mode; a community PR is welcome if someone wants to take this on.

### `[stale-no-response]`

> Closing due to no response since [DATE]. Reopen any time with the details requested above.

## Examples

| Scenario | Bucket | Action |
| --- | --- | --- |
| Reporter: "newman returned 1 because my test assertion failed" | `USER_ERROR_OR_CONFIG` | Auto-close with `[newman-side]` (the task is correctly surfacing Newman's exit code). |
| Reporter: "ETIMEDOUT against my staging API" | `USER_ERROR_OR_CONFIG` (network) | Auto-close with `[newman-side]`. |
| Reporter: "task fails with 'Undefined error', here's a screenshot" | `INSUFFICIENT_INFO` | Auto-comment with `[need-repro]`. After 14 days no response → close with `[stale-no-response]`. |
| Reporter: "can the task use my repo's local Newman install?" | `FEATURE` | Confirm with maintainer before opening a PR. |
| Reporter: "report filenames collide when iterating over a folder" | `BUG_FIXABLE` | Confirm fix sketch (per-file suffix) with maintainer, then PR. |
| Issue from 2019 asking for an input that already exists | `STALE_FIXED_UPSTREAM` | Auto-close with `[already-supported]`. |

## Version bumps and PR conventions

When a `BUG_FIXABLE` or `FEATURE` issue results in a PR:

- The PR body uses `Closes #N` for every issue it resolves so they auto-close on merge.
- Bump `NewmanPostman/task.json` `version`:
  - Patch for `BUG_FIXABLE` with no UI / behavior change.
  - Minor for new inputs or visible behavior shifts.
  - Major reserved for breaking changes (the major also moves the YAML referrer string from `NewmanPostman@4` to `NewmanPostman@5`).
- Bump `vss-extension.json` `version` (extension version) per the same scheme.
- Add a `CHANGELOG.md` entry referencing the issue numbers.

After the PR merges and the **Publish** stage in `azure-pipelines.yml` completes, post the `[fixed-in-version]` template on each closed issue.

## Maintainer tools (MCP)

For Claude sessions, the relevant GitHub MCP tools are:

- `mcp__github__list_issues` — paginate with `state: open`; use `since` for incremental passes.
- `mcp__github__issue_read` — `get` for the body, `get_comments` for replies.
- `mcp__github__issue_write` — `update` to set `state: closed` with `state_reason: completed` or `not_planned`.
- `mcp__github__add_issue_comment` — post triage replies.

All four are scoped to `carlowahlstedt/newmanpostman_vsts_task` by the MCP repository allowlist.
