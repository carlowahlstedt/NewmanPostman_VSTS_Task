# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Per the top of `README.md`, this project is **no longer actively developed**. Default to minimal, surgical changes; avoid sweeping refactors or dependency churn unless explicitly asked.

## Common commands

All commands run from the repo root unless noted. Two `package.json` files exist (root for build/dev tooling; `NewmanPostman/` for the task's runtime dependencies). `npm install` at the root does **not** install the task's runtime deps — run `install-task-lib` first after a fresh clone.

```bash
npm install                    # root dev deps (tfx-cli, mocha, typescript 2.3.4, etc.)
npm run install-task-lib       # cd NewmanPostman && npm install --save-dev (runtime deps for the task)
npm run compile                # tsc -p .  (compiles both NewmanPostman/*.ts and Tests/*.ts in place)
npm test                       # pretest runs tsc, then: npx mocha Tests//TestSuite.js
npm run package                # clean + compile + tfx extension create --rev-version  (produces .vsix)
npm run gallery-publish        # tfx extension publish  (requires marketplace credentials)
```

Run a single test by filtering on the mocha description string:

```bash
npm run compile && npx mocha Tests/TestSuite.js --grep "Environment is not mandatory"
```

Tests compile to `.js` siblings of the `.ts` sources; the mocha entrypoint (`Tests/TestSuite.js`) loads other `Tests/*.js` files as child mock-runner scripts, so all of them must be compiled, not just the file you're targeting.

## Architecture

This is an **Azure DevOps (VSTS) Pipelines extension** that wraps the [Newman](https://github.com/postmanlabs/newman) CLI as a build/release task. There is exactly one task in the extension, and almost all logic lives in a single file.

- `NewmanPostman/newmantask.ts` — the task entrypoint. Reads pipeline inputs via `azure-pipelines-task-lib`, builds a `ToolRunner` for `newman run ...`, and conditionally appends CLI flags. The flow:
  1. `GetToolRunner(collectionToRun)` translates each task input into a Newman CLI flag (`--insecure`, `-r <reporters>`, `--folder`, `--global-var`, `-e <env>`, etc.).
  2. `run()` decides the collection source. For `collectionSourceType=file` pointing at a directory, it globs the directory with the `Contents` patterns and invokes Newman **once per matched file synchronously** (`execSync`), tracking a `taskSuccess` flag. For a single file or URL, it runs `newman` once with `await exec()`.
  3. The task fails (`tl.setResult(Failed)`) if any sync invocation returns code 1, if a URL input fails `is-url` validation, or if a directory glob matches no files.
- `NewmanPostman/task.json` — the input/group schema the Azure DevOps UI renders. **Every input read by `newmantask.ts` must be declared here** with matching `name`, `type`, `groupName`, and `visibleRule`. The `execution.Node.target` is `newmantask.js` (the compiled output), and `version` here is the *task* version (currently 4.0.0), separate from the *extension* version in `vss-extension.json` (3.0.23).
- `vss-extension.json` — the marketplace manifest. The `files: [{ path: "NewmanPostman" }]` line is what causes the packaged `.vsix` to ship the compiled task folder.
- `tsconfig.json` — root-level, targets ES6/CommonJS and excludes both `node_modules` directories. Compilation emits `.js` next to each `.ts` file (no `outDir`), which the test harness and `task.json` both depend on.

## Tests

Tests use `azure-pipelines-task-lib/mock-test` and `mock-run`, which is the standard pattern for VSTS task tests:

- `Tests/TestSuite.ts` is the mocha suite. Each `it(...)` block spawns a `MockTestRunner` against a sibling `Tests/<scenario>.js` file and asserts on the captured stdout (e.g. `runner.stdOutContained('-r cli,json')`).
- Each `Tests/<scenario>.ts` (e.g. `folderAsSource.ts`, `useEnvironmentURL.ts`) is a standalone script that builds a `TaskMockRunner` for `NewmanPostman/newmantask.js`, sets inputs via `runner.setInput(...)`, registers mock answers for `which`/`stats`/`find`/`exec`/`checkPath`, optionally overrides `runMockExport('stats', ...)`, and calls `runner.run()`.
- When you add a new task input or change CLI translation logic in `newmantask.ts`, update or add a `Tests/<scenario>.ts` file **and** wire a corresponding `it(...)` block into `TestSuite.ts` — the suite does not auto-discover scenario files.

## CI

`azure-pipelines.yml` runs npm install, `install-task-lib`, `compile`, packages the `.vsix` via `PackageVSTSExtension@1`, and publishes the artifact. The `npm test` step is **commented out**, so CI does not currently gate on the mocha suite — run it locally before sending changes.

## Pinned old toolchain

`typescript@2.3.4` and `@types/node@^8.0.7` are intentionally pinned (the codebase relies on `MochaDone` and other types from that era). Do not upgrade them as part of unrelated changes — newer TypeScript will fail to compile `Tests/TestSuite.ts` without source edits.
