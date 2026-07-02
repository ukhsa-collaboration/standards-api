# Changelog

All notable changes to this project are documented in this file.

## 1.0.0 - 2026-06-25

### Breaking Changes

- Migrated the linting runtime and CI integration from Spectral-first behavior to Vacuum-first behavior.
- This changes lint execution semantics and operational workflows; teams must migrate pipelines before upgrading.

### Added

- Added a Vacuum PR report workflow to publish lint findings as pull-request feedback.
- Added centralized Vacuum invocation utilities and stronger test harness coverage for linting behavior.
- Added packaging validation (`npm pack --dry-run`) and release-hardening checks in CI.
- Added pygeoapi severity-gated rule variants inside the primary ruleset.

### Changed

- Migrated linting workflows and documentation from Spectral-first usage to Vacuum-first usage.
- Consolidated build outputs into a single `dist` layout and aligned function wrappers for Vacuum execution.
- Updated Vacuum command handling and flag compatibility in scripts and CI checks.
- Refined docs and rule examples for accuracy and consistency.

### Migration Notes

- This release marks the major-version boundary for the Vacuum migration.
- Teams still running Spectral-based pipelines should remain on `0.4.x` until they complete migration.
- Teams adopting `1.0.0` should switch CI linting to Vacuum and use the provided Vacuum workflow/docs in this repository.
