# UKHSA API Platform API Guidelines

Welcome to the UKHSA API Platform API Guidelines repository. This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Purpose

The purpose of this repository is to provide a comprehensive set of guidelines and the relevant toolset to ensure consistency, reliability, and security across all APIs developed within or on behalf of UKHSA. These guidelines cover various aspects of API design, including style, specifications, security, error handling, versioning, testing, and more.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

You will find the documentation in markdown form in the `docs/` directory, you can also view the [documentation site][1] for a friendly searchable format.

As part of the above this repository provides the spectral rules to help developers align their OpenAPI definition with the standards laid out in these guidelines.

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to Use the Rules with your API

To see how you use these rules with your project, check out the [How to use the rules][2] documentation section.

## Contributing

We welcome contributions to improve these guidelines. Please read our [Contributing Guidelines][3] for details on how to get involved.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][4].
This covers both the codebase and any sample code in the documentation.

The documentation is [© Crown copyright][5] and available under the terms
of the [Open Government 3.0][6] licence.

## Contact

TODO

[1]: https://ukhsa-collaboration.github.io/api-guidelines/
[2]: docs/spectral-rules/index.md#how-to-use-the-rules
[3]: CONTRIBUTING.md
[4]: LICENCE
[5]: https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[6]: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
