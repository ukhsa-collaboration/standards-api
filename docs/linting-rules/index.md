---
caption: API Design Guidelines
includeInBreadcrumbs: true
eleventyNavigation:
  parent: api-design-guidelines
---

# Linting Rules

## Overview

A linting ruleset was created to support API Developers/Providers in achieving the standards described in the [UKHSA API Guidelines][1], ensuring consistency, reliability, and security across all APIs developed within or on behalf of UKHSA.

As well as the rules described herein, the UKHSA ruleset extends Vacuum's built-in OpenAPI recommended baseline (`vacuum:oas`). These common sense rules help ensure an OpenAPI definition adheres to the [OpenAPI specification][2], and include documentation-focused checks that encourage high quality, rich API descriptions for the best possible APIM Developer Portal experience. See the [Vacuum rule reference][3] for details of built-in rules.

Where rules have been adopted from existing open source API rulesets, a link is supplied on the relevant rule page.

## Migration from Spectral to Vacuum

The UKHSA ruleset previously supported Spectral-oriented consumption via `@ukhsa-collaboration/spectral-rules`.

Current releases are distributed for Vacuum consumption via `@ukhsa-collaboration/openapi-linting-rules`. This is a breaking tooling change for teams moving from the Spectral package.

`@ukhsa-collaboration/spectral-rules` should be treated as a legacy package and should not be used for new integrations.

### Why we moved to Vacuum

- Faster linting in local development and CI pipelines.
- Improved handling of very large OpenAPI documents, including pygeoapi-generated specifications.

### What existing Spectral users should do next

1. Install Vacuum in your project (`npm install @quobix/vacuum --save-dev`).
1. Uninstall the legacy Spectral package (`npm uninstall @ukhsa-collaboration/spectral-rules`).
1. Install or update the Vacuum-first UKHSA ruleset package (`npm install @ukhsa-collaboration/openapi-linting-rules --save-dev`).
1. Replace Spectral config with a `vacuum.conf.yaml` file that points to `ukhsa.oas.rules.yml` and `dist/functions`.
1. Replace Spectral lint commands in local scripts and CI jobs with `npx vacuum lint ...` (Vacuum auto-discovers `./vacuum.conf.yaml`).
1. Optionally use `npx ukhsa-vacuum-lint lint ...`, a thin wrapper that injects the default ruleset, custom functions directory, and ref-resolution flags so callers do not need a `vacuum.conf.yaml`.
1. If your downstream tooling expects a Spectral-style JSON artifact, use `npx vacuum spectral-report <spec> <report.json>` during transition.

### Release story for this migration

This migration is treated as a MAJOR release event for the ruleset package because the integration contract changed from Spectral tooling to Vacuum tooling.

- Teams that still depend on Spectral should remain on the last pre-migration version until they can switch pipelines.
- Teams adopting the Vacuum integration should upgrade to the migration release and follow the steps above.
- Release notes should call out the version boundary and migration actions clearly.

## How to use the rules

### Install Vacuum

[Vacuum][4] is a fast OpenAPI linter for rulesets like this one. Install Vacuum globally or as a dev dependency.

```sh
npm install @quobix/vacuum --save-dev
```

Read the [official Vacuum documentation][5] for more installation options.

### Run Vacuum against your OpenAPI definition

Run Vacuum against your OpenAPI definition, referencing the UKHSA ruleset.

You must install the ruleset via npm and then reference it; the UKHSA ruleset npm package is hosted on GitHub — see GitHub's documentation [Installing a GitHub npm package][6].

The simplest way to authenticate against the GitHub NPM registry locally is to use the npm login command (as described [here][7]) to authenticate with GitHub Packages, this adds the required credentials to your npm configuration file i.e. `.npmrc`.

```sh
$ npm login --scope=@ukhsa-collaboration --auth-type=legacy --registry=https://npm.pkg.github.com

Username: USERNAME #GITHUB USERNAME
Password: TOKEN #GITHUB PAT TOKEN
```

```sh
npm install @ukhsa-collaboration/openapi-linting-rules --save-dev
```

Create a local vacuum configuration file `vacuum.conf.yaml` to pre-configure the use of the UKHSA ruleset.

```sh
cat << 'EOF' > vacuum.conf.yaml
ruleset: ./node_modules/@ukhsa-collaboration/openapi-linting-rules/ukhsa.oas.rules.yml
functions: ./node_modules/@ukhsa-collaboration/openapi-linting-rules/dist/functions
resolve-all-refs: true
nested-refs-doc-context: true
EOF
```

Then run Vacuum against your OpenAPI definition. Vacuum auto-discovers `./vacuum.conf.yaml` from the working directory, so no `--config` flag is needed.

```sh
npx vacuum lint ./path/to/openapi-definition.yml
```

> [!TIP] Need a JSON report?
> Use `npx vacuum spectral-report <spec> <report.json>` to generate a report you can post-process in existing tooling.

### Review and fix any reported issues

Once the linter has highlighted any issues or errors, review and fix to ensure your OpenAPI definition remains compliant with the UKHSA guidelines.

### Severity overrides

Some OpenAPI definitions produced by platforms like [pygeoapi][8] might struggle to meet every **MUST** requirement. This is often because these issues are outside the consuming team's direct control, as fixes would require upstream contributions or maintaining a fork. To accommodate this, the ruleset ships paired `-pygeoapi` rule variants that fire at `warn` instead of `error` when an OpenAPI document declares `info.x-api-type: pygeoapi`. Selection is automatic — there is only one ruleset (`ukhsa.oas.rules.yml`).

See [severity overrides][9] for the full list of relaxed rules and how to opt into the relaxed severities.

### CI/CD GitHub Actions

The following is a sample GitHub Actions job that can be used as an example of setting up linting as part of your CI/CD pipeline.

Commit a `vacuum.conf.yaml` to the root of your repository so it is reused by both local development and CI; Vacuum auto-discovers `./vacuum.conf.yaml` from the working directory.

```yaml
# vacuum.conf.yaml (commit this to the root of your repository)
ruleset: ./node_modules/@ukhsa-collaboration/openapi-linting-rules/ukhsa.oas.rules.yml
functions: ./node_modules/@ukhsa-collaboration/openapi-linting-rules/dist/functions
resolve-all-refs: true
nested-refs-doc-context: true
```

<!-- {% raw %} -->

```yaml
name: API Standards Checks

on:
  pull_request:
    branches: [main, master] # Example only - you would typically use either 'main' or 'master', not both

jobs:
  lint-openapi:
    name: Lint OpenAPI
    runs-on: ubuntu-latest

    permissions:
      contents: read
      issues: read
      checks: write
      pull-requests: write
      packages: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "22.x"
          registry-url: "https://npm.pkg.github.com"
          # Defaults to the user or organization that owns the workflow file
          scope: "@ukhsa-collaboration"

      - name: Install linting dependencies
        run: npm install @quobix/vacuum @ukhsa-collaboration/openapi-linting-rules
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Lint OpenAPI specifications
        run: |
          # Uses the vacuum.conf.yaml committed to the repository root.
          npx vacuum lint ./*.{json,yml,yaml}

          # Example: Only lint OpenAPI files (requires bash extglob if uncommented)
          # shopt -s extglob
          # npx vacuum lint ./@(openapi|swagger|*api)*.{json,yml,yaml}
```

<!-- {% endraw %} -->

The unquoted shell pattern above relies on shell expansion to target JSON and YAML files in the current working directory before Vacuum runs.

The stricter example uses [glob syntax][10] to target only OpenAPI specification files.

The glob pattern `./@(openapi|swagger|*api)*.{json,yml,yaml}` matches:

> [!TIP] Matches
>
> ```text
> openapi.json
> something.api.yaml
> swagger.json
> ```

The glob pattern does not match:

> [!CAUTION] Does Not Match
>
> ```text
> /node_modules/openapi.yaml
> /.git/something.json
> ```

If you use that stricter example in bash, enable extended globbing first with `shopt -s extglob`.

### Additional Recommended Tooling

| Tool | Description |
| - | - |
| [Vacuum GitHub Action][11] | Official Vacuum action for linting OpenAPI definitions in CI/CD workflows. |
| [Vacuum VS Code Extension][12] | VS Code extension for running Vacuum linting locally. |

### Official GitHub Action Example

If you want the quickest GitHub Actions integration for a single OpenAPI file, use the official Vacuum action directly:

```yaml
name: Lint OpenAPI spec with vacuum

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read
  pull-requests: write

jobs:
  vacuum-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '22.x'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build ruleset and Vacuum functions
        run: npm run build

      - name: Run official Vacuum action
        uses: pb33f/vacuum-action@v2
        with:
          openapi_path: example/example.1.0.0.oas.yml
          ruleset: ukhsa.oas.rules.yml
          github_token: ${{ secrets.GITHUB_TOKEN }}
          fail_on_error: true
          print_logs: true
```

This path is operationally simple and posts a Markdown report comment on pull requests. It does not create inline file annotations in the GitHub diff view. The action expects a concrete file path; if you need to lint multiple files, run `npx vacuum lint` in a shell step instead so your shell can expand the file pattern before Vacuum starts.

Read the [official Vacuum documentation][5] for more development workflows.

[1]: ../api-guidelines/index.md
[2]: https://swagger.io/specification/
[3]: https://quobix.com/vacuum/rules/
[4]: https://quobix.com/vacuum/
[5]: https://quobix.com/vacuum/installing/
[6]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package
[7]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[8]: https://pygeoapi.io/
[9]: ./severity-overrides.md
[10]: https://github.com/mrmlnc/fast-glob
[11]: https://github.com/marketplace/actions/vacuum-openapi-linter-and-quality-analysis-tool
[12]: https://marketplace.visualstudio.com/items?itemName=pb33f.vacuum
