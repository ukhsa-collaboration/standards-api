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
npm install -g @stoplight/spectral-cli
```

Read the [official spectral documentation][7] for more installation options.

### Run Spectral against your OpenAPI definition

Run Spectral against your OpenAPI definition, referencing the spectral ruleset.

You can reference a ruleset hosted via [HTTP server][8].

> You can only reference the raw Github URL if the github repository is public.

```sh
spectral lint openapi-definition.yml --ruleset https://raw.githubusercontent.com/ukhsa-collaboration/api-guidelines/refs/heads/main/.spectral.yaml
```

You can install the ruleset as via [npm package][9] and then reference that, bear in mind the UKHSA ruleset npm package is hosted in github so please read Github's documentation [Working with the npm registry][10].

```sh
npm install @ukhsa-collaboration/spectral-rules
spectral lint openapi-definition.yml --ruleset ./node_modules/@ukhsa-collaboration/spectral-rules/.spectral.yaml
```

or create a local `.spectral.yml` ruleset which extends the one in this repository.

```bash
echo "extends: ['@ukhsa-collaboration/spectral-rules']" > .spectral.yml
```

then you can just run the following.

```sh
spectral lint openapi-definition.yml
```

### Review and fix any reported issues

Once the linter has highlighted any issues or errors, review and fix to ensure your OpenAPI definition remains compliant with the UKHSA guidelines.

### CI/CD Github Actions

The following is a sample Github actions job which can be used as an example of setting up linting as part of you CI/CD pipeline.

```yaml
...
jobs:
  lint-openapi:
    name: Lint OpenAPI
    runs-on: ubuntu-latest

    permissions:
      contents: read
      issues: read
      checks: write
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'
          registry-url: 'https://npm.pkg.github.com'
          # Defaults to the user or organization that owns the workflow file
          scope: '@ukhsa-collaboration'

      - run: npm install @ukhsa-collaboration/spectral-rules
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Install spectral
        run: curl -L https://raw.github.com/stoplightio/spectral/master/scripts/install.sh | sh

      - name: Lint example OpenAPI
        run: |
          spectral --version
          spectral lint "*.{json,yml,yaml}" -r ${{ GITHUB.WORKSPACE }}/node_modules/@ukhsa-collaboration/spectral-rules/.spectral.yaml -f github-actions
```

### Additional Recommended Tooling

| Tool | Description |
| - | - |
| [VS Code Extension][11] | Official spectral VS Code extension provides real time linting / intellisense on your OpenAPI definition. |
| [Github Action][12] | Official spectral Github action provides ability to lint your OpenAPI definition in CI/CD workflows. |

> [!IMPORTANT]
> To run the spectral linter in your git hub CI/CD workflow you will need to ensure your repository is [added to the list of repositories allowed to download the npm package][13].

Read the [official spectral documentation][14] for more development workflows.

[1]: ../api-guidelines/index.md
[2]: https://docs.stoplight.io/docs/spectral/0a73453054745-recommended-or-all
[3]: https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules
[4]: https://github.com/stoplightio/spectral-documentation
[5]: https://swagger.io/specification/
[6]: https://docs.stoplight.io/docs/spectral
[7]: https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation
[8]: https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#http-server
[9]: https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#npm
[10]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
[11]: https://marketplace.visualstudio.com/items?itemName=stoplight.spectral
[12]: https://github.com/marketplace/actions/spectral-linting
[13]: https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#github-actions-access-for-packages-scoped-to-personal-accounts
[14]: https://docs.stoplight.io/docs/spectral/ecaa0fd8a950d-workflows
