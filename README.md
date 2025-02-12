# UKHSA API Platform API Guidelines

Welcome to the UKHSA API Platform API Guidelines repository. This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Purpose

The purpose of this repository is to provide a comprehensive set of guidelines and the relevant toolset to ensure consistency, reliability, and security across all APIs developed within or on behalf of UKHSA. These guidelines cover various aspects of API design, including style, specifications, security, error handling, versioning, testing, and more.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

You will find the documentation in markdown form in the `docs/` directory, you can also view the [documentation site](https://refactored-chainsaw-8qmo7ge.pages.github.io/) for a friendly searchable format.

As part of the above this repository provides the spectral rules to help developers align their OpenAPI definition with the standards laid out in these guidelines.

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to Use to Rules with your API

### Install Spectral

[Spectral](https://docs.stoplight.io/docs/spectral) is a flexible JSON/YAML linter for creating automated style guides, with baked in support for OpenAPI (v3.1, v3.0, and v2.0), Arazzo v1.0, as well as AsyncAPI v2.x.

Install Spectral globally or as a dev dependency.

```sh
npm install -g @stoplight/spectral-cli
```

Read the [official spectral documentation](https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation) for more installation options.

### Run Spectral against your OpenAPI definition

Run Spectral against your OpenAPI definition, referencing the spectral ruleset.

You can reference a ruleset hosted via [HTTP server](https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#http-server).

> You can only reference the raw Github URL if the github repository is public.

``` sh
spectral lint openapi-definition.yml --ruleset https://raw.githubusercontent.com/UKHSA-Internal/api-guidelines/refs/heads/main/.spectral.yaml
```

You can install the ruleset as via [npm package](https://meta.stoplight.io/docs/spectral/7895ff1196448-sharing-and-distributing-rulesets#npm) and then reference that, bear in mind the UKHSA ruleset npm package is hosted in github so please read Github's documentation [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

``` sh
npm install @ukhsa-internal/spectral-rules
spectral lint openapi-definition.yml --ruleset ./node_modules/@ukhsa-internal/spectral-rules/.spectral.yaml
```

or create a local `.spectral.yml` ruleset which extends the one in this repository.

```bash
echo "extends: ['@ukhsa-internal/spectral-rules']" > .spectral.yml
```

then you can just run the following.

```sh
spectral lint openapi-definition.yml
```

### Review and fix any reported issues

Once the linter has highlighted any issues or errors, review and fix to ensure your OpenAPI definition remains compliant with the UKHSA guidelines.

### Additional Recommended Tooling

| Tool | Description |
| ---- | ----------- |
| [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral) | Official spectral VS Code extension provides real time linting / intellisense on your OpenAPI definition. |
| [Github Action](https://github.com/marketplace/actions/spectral-linting) | Official spectral Github action provides ability to lint your OpenAPI definition in CI/CD workflows. |

> [!IMPORTANT]
> To run the spectral linter in your git hub CI/CD workflow you will need to ensure your repository is [added to the list of repositories allowed to download the npm package](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#github-actions-access-for-packages-scoped-to-personal-accounts).
>

Read the [official spectral documentation](https://docs.stoplight.io/docs/spectral/ecaa0fd8a950d-workflows) for more development workflows.

## How to contribute

### Clone the Repository

``` sh
git clone https://github.com/UKHSA-Internal/api-guidelines.git
cd api-guidelines
```

### Navigate the Documentation

The documentation is organised into various markdown files under the `docs/` directory. You can add or edit markdown files, see the [MkDocs documentation](https://www.mkdocs.org/user-guide/writing-your-docs/) for more information.

### View the Guidelines

You can view the guidelines directly in your markdown viewer of choices or use the same static site generator (MkDocs) used to produce the github pages to serve the documentation locally.

To install MkDocs your will require python 3.X once you have this you can install MkDocs and its plugins.

MkDocs requires an `mkdocs.yml` file for configuration and navigation control, the one supplied in the repo is the one used for github pages but should work fine locally also.

``` sh
pip install mkdocs-material
pip install markdown-callouts
pip install mkdocs-git-revision-date-localized-plugin
pip install mkdocs-git-committers-plugin-2
pip install mkdocs-exporter
pip install mkdocs-redirects
pip install mkdocs-awesome-pages-plugin

playwright install --with-deps
playwright install chrome --with-deps
```

To serve the documentation using MkDocs:

``` sh
mkdocs serve
```

This will start a local server, and you can view the documentation in your browser at `http://127.0.0.1:8000`.

### 3. Create a Pull Request

When you are ready to submit your contribution please follow the contribution guidelines and submit a pull request with your changes.

## License

TODO

## Contact

TODO
