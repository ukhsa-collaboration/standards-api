# UKHSA API Platform API Guidelines

Welcome to the UKHSA API Platform API Guidelines repository. This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Purpose

The purpose of this repository is to provide a comprehensive set of guidelines and the relevant toolset to ensure consistency, reliability, and security across all APIs developed within or on behalf of UKHSA. These guidelines cover various aspects of API design, including style, specifications, security, error handling, versioning, testing, and more.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

You will find the documentation in markdown form in the `docs/` directory, you can also view the [documentation site][1] for a friendly searchable format.

As part of the above this repository provides linting rules to help developers align their OpenAPI definition with the standards laid out in these guidelines. The rules are designed to run with [Vacuum][2] for better performance and stability on large specs.

Earlier releases used a Spectral-oriented workflow via `@ukhsa-collaboration/spectral-rules`. The published `@ukhsa-collaboration/openapi-linting-rules` package is now Vacuum-first, and `@ukhsa-collaboration/spectral-rules` should be treated as legacy for this ruleset.

If you are upgrading from Spectral usage, follow the migration steps in the linting rules documentation and update CI/local commands to use Vacuum and `vacuum.conf.yaml` defaults [7][3].

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to Use the Rules with your API

To see how you use these rules with your project, check out the [How to use the rules][4] documentation section.

## Contributing

We welcome contributions to improve these guidelines. Please read our [Contributing Guidelines][5] for details on how to get involved.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][6].
This covers both the codebase and any sample code in the documentation.

The documentation is [© Crown copyright][7] and available under the terms
of the [Open Government 3.0][8] licence.

## Contact

TODO

[1]: https://ukhsa-collaboration.github.io/standards-org/api-design-guidelines/
[2]: https://quobix.com/vacuum/
[3]: docs/linting-rules/index.md#migration-from-spectral-to-vacuum
[4]: docs/linting-rules/index.md#how-to-use-the-rules
[5]: CONTRIBUTING.md
[6]: LICENCE
[7]: https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[8]: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
