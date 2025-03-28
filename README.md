# UKHSA API Platform API Guidelines

Welcome to the UKHSA API Platform API Guidelines repository. This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Purpose

The purpose of this repository is to provide a comprehensive set of guidelines and the relevant toolset to ensure consistency, reliability, and security across all APIs developed within or on behalf of UKHSA. These guidelines cover various aspects of API design, including style, specifications, security, error handling, versioning, testing, and more.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

You will find the documentation in markdown form in the `docs/` directory, you can also view the [documentation site](https://ukhsa-collaboration.github.io/api-guidelines/) for a friendly searchable format.

As part of the above this repository provides the spectral rules to help developers align their OpenAPI definition with the standards laid out in these guidelines.

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to Use to Rules with your API

To see how you use these rules with your project checkout the [How to use the rules](docs/spectral-rules/index.md#how-to-use-the-rules) documentation section.

## How to contribute

### Clone the Repository

``` sh
git clone https://github.com/ukhsa-collaboration/api-guidelines.git
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
pip install pytest-playwright
pip install mkdocs-print-site-plugin
pip install mkdocs-tech-docs-template
pip install mkdocs-redirects
pip install mkdocs-awesome-pages-plugin

# Only needed if you want to generate site pdf locally
playwright install --with-deps
playwright install chrome --with-deps
```

To serve the documentation using MkDocs:

``` sh
mkdocs serve
# generate a pdf locally with the following command
# playwright pdf --wait-for-selector=#print-site-page localhost:8000/print_page/ docs/ukhsa-api-guidelines.pdf
```

This will start a local server, and you can view the documentation in your browser at `http://127.0.0.1:8000`.

### 3. Create a Pull Request

When you are ready to submit your contribution please follow the contribution guidelines and submit a pull request with your changes.

## License

TODO

## Contact

TODO
