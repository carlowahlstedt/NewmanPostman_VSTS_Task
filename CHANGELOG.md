# Changelog

## v4.3.3 — task / 3.2.3 — extension

### Added
- New `Node24` execution handler in `task.json` alongside the existing `Node20_1`. Agents that support Node 24 will prefer it; older agents fall through to Node 20 with no change in behavior. Sets `minimumAgentVersion: 4.265.1` (required for the Node 24 handler) — self-hosted agents older than that will need to upgrade. (#126)

### Changed
- TypeScript `compilerOptions.target` raised from ES6 to ES2022. Node 20+ supports the full ES2022 surface natively; output bundle is unchanged for the runtime task but allows newer syntax in future contributions.
- Test suite refactored: each `it()` now goes through a `makeRunner()` helper that pins `runner.nodePath = process.execPath`. This stops the mock test runner from downloading `node-v16.20.2-linux-x64.tar.gz` on the first test of a cold CI agent — which was the root cause of the flake hot-fixed in v3.2.2. Reverts the `--timeout 30000` mocha flag added then.
- Defensive catch typing in `newmantask.ts`: `err.message` → `err instanceof Error ? err.message : String(err)`, conforming to TS 5's `unknown` catch parameter.
- Test script path typo `Tests//TestSuite.js` → `Tests/TestSuite.js`.

Credit to @esbenbach (#126) for the Node 24 handler, the `nodePath` test-runner fix, and the catch-typing pattern.

## v4.3.2 — task / 3.2.2 — extension

### Security
- Pin transitive `minimatch` to `^9.0.5` via npm `overrides` in both `package.json` files. Patches three high-severity ReDoS advisories (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74) that affected `minimatch <= 3.1.3`, which was being pulled in by `azure-pipelines-task-lib`. The packaged `.vsix` now ships minimatch 9.x for the `Contents` glob matching in folder-mode runs.
- Pin transitive `serialize-javascript` to `^7.0.5` at root. Patches two advisories (RCE via `RegExp.flags`/`Date.prototype.toISOString`, CPU-exhaustion DoS) that affected the dev-only mocha → serialize-javascript chain. No runtime impact.
- Residual: `uuid <11.1.1` (GHSA-w5hq-g745-h8pq, moderate) remains in `azure-pipelines-task-lib`'s dependency tree because the task-lib uses the legacy `require('uuid/v4')` deep import, which uuid 7+ removed. The vulnerable code path requires a `buf` argument that the task-lib never passes, so the practical exposure is nil. A full fix requires the upstream task-lib to migrate off the deep-import API.

## v4.3.1 — task / 3.2.1 — extension

### Added
- New `Use npx to invoke newman` checkbox (advanced group) — when enabled, the task runs `npx newman` instead of looking up a global `newman` binary. Use this on build agents that disallow global npm installs. (#55)
- The task now automatically prefers `./node_modules/.bin/newman` (relative to the agent's current directory) when `Path to Newman` is unset, `Use npx` is unchecked, and the local binary exists. Falls through to the global `newman` on PATH if not found. (#105)

The resolution order is: `pathToNewman` → `useNpx` → local `./node_modules/.bin/newman` → global `newman`.

## v4.3.0 — task / 3.2.0 — extension

### Added
- New `Working Directory` input (advanced group) that forwards `--working-dir <path>` to newman. Set it when your collection references files via relative paths (e.g. iteration data referenced from a request body) and those files live somewhere other than the agent's current directory. (#104)

## v4.2.0 — task / 3.1.0 — extension

### Changed
- When the task iterates over multiple collections in a folder (via `collectionFileSource` + `Contents`), each per-collection reporter export filename is now suffixed with the collection's base name. For example, `reporterJUnitExport: /out/report.xml` now produces `/out/report-collection1.xml`, `/out/report-collection2.xml`, etc. — so the per-collection results no longer overwrite each other. Single-file runs are unchanged. Affects the html, htmlextra, json, and junit reporter export paths. (#102, #66, #62)

## v4.1.2 — task / 3.0.26 — extension

### Fixed
- The `forceNoColor` input now emits `--color off` instead of the removed `--no-color` flag, so newman correctly disables colored CLI output. The previous code silently failed on any newman version released since 2019. (#50)

## v4.1.1 — task / 3.0.25 — extension

### Fixed
- Pass the htmlextra template path through with the correct flag and variable. The previous code emitted `--reporter-htmlextra-template ` (trailing space) and forwarded the plain `html` template path instead of the configured `htmlextra` template, so the input was silently ignored. (#99, #117)

## v4.1.0 — task / 3.0.24 — extension

### Changed
- Migrated the task off the end-of-life Node 6 execution handler to `Node20_1`. Pipelines using `NewmanPostman@4` heal automatically on next run; no YAML changes required. (#101, #110, #111, #115)
- Modernized the supporting toolchain: `azure-pipelines-task-lib` 2 → 4, TypeScript 2.3 → 5, `@types/node` 8 → 20, mocha 5 → 10, tfx-cli 0.7 → 0.17. (#115)
- Restored CI: pipeline now runs on `ubuntu-latest`, the previously-disabled `npm test` step gates the build, and `TfxInstaller@1` was bumped to `v0.17.x` to silence a stderr warning that was failing the package step. (#113)

### Fixed
- Test scenarios were calling `setInput('environmentFile', ...)` while the actual task input is named `environment`; the suite has been quietly broken in CI for years because `npm test` was commented out. (#113)
