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

## Pygeoapi severity overrides

Some definitions (for example, produced by pygeoapi) cannot yet meet every **MUST** requirement in the ruleset. When an OpenAPI document is marked with `info.x-api-type: pygeoapi`, the ruleset automatically downgrades the following error-level rules to `warn`:

- `must-define-a-format-for-integer-types`
- `must-define-a-format-for-number-types`
- `must-define-security-schemes`
- `must-have-info-api-audience`
- `must-have-info-contact-email`
- `must-have-info-value-chain`
- `must-have-info-version`
- `must-specify-default-response`
- `must-use-camel-case-for-property-names`
- `must-use-camel-case-for-query-parameters`
- `must-use-https-protocol-only`
- `must-use-problem-json-as-default-response`
- `must-use-problem-json-for-errors`
- `must-use-valid-version-info-schema`

Other rules continue to run normally, so pygeoapi definitions should still be linted and improved where possible. Rules already at `warn` are not changed.

### `info.x-api-type` values

To make intent explicit, the `info.x-api-type` field can be treated as an enum in API definitions to indicate the API category:

- `standard` – default behavior; no overrides applied.
- `pygeoapi` – pygeoapi-based definitions; error-level rules listed above are downgraded to `warn`.

If you omit `info.x-api-type`, the ruleset assumes the API is `standard`.

See also: [MAY have info.x-api-type][6].

When generating a definition from a local pygeoapi instance, you can inject the `info.x-api-type` flag during export so relaxed severities will be applied. The example below wraps the `pygeoapi openapi generate` command in Docker, binds your local configuration, and uses `yq` to add `info.x-api-type: pygeoapi` before writing the result to `openapi-pygeoapi.yml`.

```sh
docker run --entrypoint= --rm -p 5000:80 \
  --mount type=bind,src=./pygeoapi-config.yml,dst=/pygeoapi/config.yml \
  -e PYGEOAPI_CONFIG=/pygeoapi/config.yml geopython/pygeoapi:latest \
  sh -c 'pygeoapi openapi generate $PYGEOAPI_CONFIG'  \
| yq '.info += {"x-api-type": "pygeoapi"}' - > openapi-pygeoapi.yml
```

## How to use the rules

### Install Spectral

[Spectral][7] is a flexible JSON/YAML linter for creating automated style guides, with baked in support for OpenAPI (v3.1, v3.0, and v2.0), Arazzo v1.0, as well as AsyncAPI v2.x.

Install Spectral globally or as a dev dependency.

```sh
npm install @stoplight/spectral-cli --save-dev
```

Read the [official spectral documentation][8] for more installation options.

### Run Spectral against your OpenAPI definition

Run Spectral against your OpenAPI definition, referencing the spectral ruleset.

You must install the ruleset as via [npm package][9] and then reference that, bear in mind the UKHSA ruleset npm package is hosted in github so please read Github's documentation [Installing a GitHub npm package][10].

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

The above example uses [glob syntax][11] to target only OpenAPI specification files.

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
| [VS Code Extension][12] | Official spectral VS Code extension provides real time linting / intellisense on your OpenAPI definition. |
| [Github Action][13] | Official spectral Github action provides ability to lint your OpenAPI definition in CI/CD workflows. |

Read the [official spectral documentation][14] for more development workflows.

[1]: ../api-guidelines/index.md
[2]: https://docs.stoplight.io/docs/spectral/0a73453054745-recommended-or-all
[3]: https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules
[4]: https://github.com/stoplightio/spectral-documentation
[5]: https://swagger.io/specification/
[6]: may/may-have-info-x-api-type.md
[7]: https://docs.stoplight.io/docs/spectral
[8]: https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation
[9]: https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#npm
[10]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package
[11]: https://github.com/mrmlnc/fast-glob
[12]: https://marketplace.visualstudio.com/items?itemName=stoplight.spectral
[13]: https://github.com/marketplace/actions/spectral-linting
[14]: https://docs.stoplight.io/docs/spectral/ecaa0fd8a950d-workflows
