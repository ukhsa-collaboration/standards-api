---
caption: API Design Guidelines
includeInBreadcrumbs: true
eleventyNavigation:
  parent: api-design-guidelines
---

# Spectral Rules

## Overview

A linting ruleset was created to support API Developers/Providers in achieving the standards described in the [UKHSA API Guidelines][1], ensuring consistency, reliability, and security across all APIs developed within or on behalf of UKHSA.

As well as the rules described herein, the UKHSA ruleset includes the [recommended][2] built in spectral [OpenAPI Rules][3] and the [Spectral Documentation Ruleset][4]; These are common sense rules that ensure an OpenAPI definition adheres to the [OpenAPI specification][5], as well as encourage high quality, rich documentation which is especially important for providing the best possible APIM Developer Portal experience.

Where rules been adopted from from existing open source API rulesets a link is supplied on the relevant rule page.

## How to use the rules

### Install Spectral

[Spectral][6] is a flexible JSON/YAML linter for creating automated style guides, with baked in support for OpenAPI (v3.1, v3.0, and v2.0), Arazzo v1.0, as well as AsyncAPI v2.x.

Install Spectral globally or as a dev dependency.

```sh
npm install @stoplight/spectral-cli --save-dev
```

Read the [official spectral documentation][7] for more installation options.

### Run Spectral against your OpenAPI definition

Run Spectral against your OpenAPI definition, referencing the spectral ruleset.

You must install the ruleset as via [npm package][8] and then reference that, bear in mind the UKHSA ruleset npm package is hosted in github so please read Github's documentation [Installing a GitHub npm package][9].

```sh
npm install @ukhsa-collaboration/spectral-rules --save-dev
```

create a local `.spectral.yml` ruleset which extends the one in this repository.

```bash
echo "extends: ['@ukhsa-collaboration/spectral-rules']" > .spectral.yml
```

then you can just run the following.

```sh
npx spectral lint openapi-definition.yml
```

### Review and fix any reported issues

Once the linter has highlighted any issues or errors, review and fix to ensure your OpenAPI definition remains compliant with the UKHSA guidelines.

### CI/CD Github Actions

The following is a sample Github actions job which can be used as an example of setting up linting as part of you CI/CD pipeline.

```yaml
...
---
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
        uses: actions/checkout@v5

      - uses: actions/setup-node@v4
        with:
          node-version: "22.x"
          registry-url: "https://npm.pkg.github.com"
          # Defaults to the user or organization that owns the workflow file
          scope: "@ukhsa-collaboration"

      - run: npm install @ukhsa-collaboration/spectral-rules
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Lint OpenAPI specifications
        run: |
          npx spectral --version
          npx spectral lint "*.{json,yml,yaml}" -r ${{ GITHUB.WORKSPACE }}/node_modules/@ukhsa-collaboration/spectral-rules/.spectral.yaml -f github-actions

          # Example: Only lint OpenAPI files
          # npx spectral lint "@(openapi|swagger|*api)*.{json,yml,yaml}" -r ${{ GITHUB.WORKSPACE }}/node_modules/@ukhsa-collaboration/spectral-rules/.spectral.yaml -f github-actions
```

The above example uses [glob syntax][10] to target only OpenAPI specification files.

The glob pattern `@(openapi|swagger|*api)*.{json,yml,yaml}` matches:

> ```text
> openapi.json
> something.api.yaml
> swagger.json
> ```

The global pattern does not match:

> ```text
> /node_modules/openapi.yaml
> /.git/something.json
> ```

### Additional Recommended Tooling

| Tool | Description |
| - | - |
| [VS Code Extension][11] | Official spectral VS Code extension provides real time linting / intellisense on your OpenAPI definition. |
| [Github Action][12] | Official spectral Github action provides ability to lint your OpenAPI definition in CI/CD workflows. |

Read the [official spectral documentation][13] for more development workflows.

[1]: ../api-guidelines/index.md
[2]: https://docs.stoplight.io/docs/spectral/0a73453054745-recommended-or-all
[3]: https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules
[4]: https://github.com/stoplightio/spectral-documentation
[5]: https://swagger.io/specification/
[6]: https://docs.stoplight.io/docs/spectral
[7]: https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation
[8]: https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#npm
[9]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package
[10]: https://github.com/mrmlnc/fast-glob
[11]: https://marketplace.visualstudio.com/items?itemName=stoplight.spectral
[12]: https://github.com/marketplace/actions/spectral-linting
[13]: https://docs.stoplight.io/docs/spectral/ecaa0fd8a950d-workflows
