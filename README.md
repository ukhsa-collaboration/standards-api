# UKHSA API Platform API Guidelines

Welcome to the UKHSA API Platform API Guidelines repository. This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Purpose

The purpose of this repository is to provide a comprehensive set of guidelines and the relevant toolset to ensure consistency, reliability, and security across all APIs developed within UKHSA. These guidelines cover various aspects of API design, including style, specifications, security, error handling, versioning, testing, and more.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

You will find the documentation in markdown form in the `docs/` directory, you can also view the [documentation site](https://refactored-chainsaw-8qmo7ge.pages.github.io/) for a friendly searchable format.

As part of the above this repository provides the spectral rules to help developers align their OpenAPI specification with the standards laid out in these guidelines.

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to Use to Rules with your API

Spectral is a linter that checks your OpenAPI specifications to ensure they follow our guidelines and best practices. To use the rules from this repository:

### Install Spectral

Install Spectral globally or as a dev dependency.

```sh
npm install -g @stoplight/spectral-cli
```

Read the [official spectral documentation](https://docs.stoplight.io/docs/spectral/b8391e051b7d8-installation) for more installation options.

### Run Spectral against your OpenAPI file

Run Spectral against your OpenAPI file, referencing the spectral config, you can either reference the ruleset directly via a github URL i.e.

``` sh
spectral lint your-api-spec.yml --ruleset https://raw.githubusercontent.com/UKHSA-Internal/api-guidelines/refs/heads/main/.spectral.yaml
```

or create a local `.spectral.yml` ruleset which extends the one in this repository.

```bash
echo "extends: [https://raw.githubusercontent.com/UKHSA-Internal/api-guidelines/refs/heads/main/.spectral.yaml]" \
    > .spectral.yml
```

then you can just run the following.

```sh
spectral lint your-api-spec.yml
```

Read the [official spectral documentation](https://docs.stoplight.io/docs/spectral/ecaa0fd8a950d-workflows) for more development workflows such as vscode highlighting, continuos integration etc.

### Review and fix any reported issues

Review and fix any reported issues to ensure your specification remains compliant with the UKHSA guidelines.

## How to contribute

### Clone the Repository

``` sh
git clone https://github.com/UKHSA-Internal/api-guidelines.git
cd api-guidelines
```

### Navigate the Documentation

The documentation is organised into various markdown files under the `docs/` directory. You can add markdown files or edit existing ones, see the [mkdocs documentation](https://www.mkdocs.org/user-guide/writing-your-docs/) for more information.

### View the Guidelines

You can view the guidelines directly in your markdown viewer or use a static site generator like MkDocs to serve the documentation locally.

To install mkdocs your will require python 3.X once you have this you can install mkdocs and its plugins.

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
