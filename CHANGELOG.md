# Changelog

All notable changes to this project are documented in this file.

## 2.0.0 - 2026-11-10

### Breaking Changes

- Added the `must-use-uri-versioning` rule at `error` severity. Every path must have a `MAJOR` version segment such as `v1` before the resource, after a base prefix that is the same on every path (for example `/v1/users` or `/api/v1/users`), unless every `servers[].url` ends with the version. Specifications without one, or with the version after the resource such as `/users/v1`, now fail linting ([#215][1], [#274][2]).
- Raised the supported Node.js version from `>=22.21.0 <23` to `>=24.22.2 <25`, and npm from `>=10` to `>=11` ([#267][3]).

### Added

- Added the `hasUriVersioning` custom function, published in `dist/functions` ([#215][1]).

### Changed

- Turned off the inherited Zalando rule `must-not-use-uri-versioning`, which contradicted UKHSA's versioning guidance ([#215][1]).
- The naming and versioning guidelines now say that APIM adds the `/namespace/product` prefix, so paths in the source OpenAPI document start at the version ([#274][2]).
- Tested the ruleset against Vacuum `0.39.3` and updated the official Vacuum action example to lint a glob of specifications ([#253][4]).

### Fixed

- Custom function findings now reach the Vacuum report. Their paths are converted to JSONPath strings, where Vacuum `0.31.0` and later previously replaced each finding with a decoding error and earlier versions dropped it silently ([#268][5]).
- `must-use-valid-problem-json-schema` accepts OpenAPI 3.1 type arrays, such as `type: [string, 'null']`, for the `Problem` members ([#269][6]).

### Migration Notes

- Put a `MAJOR` version segment before the resource in your paths, such as `/v1/users`, or end every `servers[].url` with it. Leave out the `/namespace/product` prefix that APIM adds. Turn off `must-use-uri-versioning` in your own ruleset while you migrate if you need to.
- Run linting on Node.js 24 and use Vacuum `0.39.3` or later.
- Expect new findings from custom function rules, such as `must-use-valid-problem-json-schema`, which earlier releases did not report under recent Vacuum versions.

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

[1]: https://github.com/ukhsa-collaboration/standards-api/pull/215
[2]: https://github.com/ukhsa-collaboration/standards-api/pull/274
[3]: https://github.com/ukhsa-collaboration/standards-api/pull/267
[4]: https://github.com/ukhsa-collaboration/standards-api/pull/253
[5]: https://github.com/ukhsa-collaboration/standards-api/pull/268
[6]: https://github.com/ukhsa-collaboration/standards-api/pull/269
