# UKHSA API Platform API Guidelines

This document supplements the API Strategy to provide detailed guidance on patterns and standards.

## Introduction

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

### When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

### How to read the guidelines

The CAPITALIZED words throughout these guidelines have a special meaning:

```text
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in 
this document are to be interpreted as described in RFC2119.
```

Refer to [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119) for details.

### How to use these guidelines

Each section addresses key aspects of building APIs, including naming conventions, versioning, security, error handling, and documentation.

Here’s how to navigate and use these guidelines effectively:

Review the sections on API design, naming conventions, versioning and error handling and create an OpenAPI specification that adheres to these patterns.
Determine your security requirements and apply the recommended authorisation, authentication and security patterns, such as OAuth 2.0, JWTs, and Role-Based Access Control (RBAC).
Ensure your API is well-documented including error scenarios and example responses within the OpenAPI specification.
Use the recommended tools for linting, validating and testing your OpenAPI specification and other aspects of your API.

- [API Specification \& Documentation](docs/api-specifications-and-documentation.md#api-specification--documentation)
  - [Generating code from OpenAPI specifications](docs/api-specifications-and-documentation.md#generating-code-from-openapi-specifications)
  - [Validating API requests against OpenAPI specifications](docs/api-specifications-and-documentation.md#validating-api-requests-against-openapi-specifications)
  - [Example responses \& mock responses](docs/api-specifications-and-documentation.md#example-responses--mock-responses)
- [API Design](docs/api-design.md#api-design)
  - [RESTful API Style](docs/api-design.md#restful-api-style)
  - [REST Maturity Levels](docs/api-design.md#rest-maturity-levels)
  - [HTTP Methods \& Semantics](docs/api-design.md#http-methods--semantics)
  - [Response Format](docs/api-design.md#response-format)
  - [Content Negotiation](docs/api-design.md#content-negotiation)
  - [REST HTTP Response Codes](docs/api-design.md#rest-http-response-codes)
- [Naming Conventions](docs/naming-conventions.md#naming-conventions)
  - [URI Structure](docs/naming-conventions.md#uri-structure)
    - [Namespaces](docs/naming-conventions.md#namespaces)
  - [Resource Names](docs/naming-conventions.md#resource-names)
  - [Path Segments](docs/naming-conventions.md#path-segments)
  - [Parameter Names](docs/naming-conventions.md#parameter-names)
  - [Field Names](docs/naming-conventions.md#field-names)
  