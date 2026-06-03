# Changelog

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
