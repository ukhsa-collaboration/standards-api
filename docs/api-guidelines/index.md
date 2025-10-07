---
caption: API Design Guidelines
includeInBreadcrumbs: true
eleventyNavigation:
  parent: api-design-guidelines
order: 1
---

# API Guidelines

## Overview

> This documentation supplements the API Strategy to provide detailed guidance on patterns and standards.

Standardising API design reduces friction, making APIs easier to understand, use, and maintain. APIs designed with consistent patterns are more intuitive and user-friendly with a common set of expectations that will enable better collaboration between teams.

These guidelines will ensure that all APIs follow accepted design, security and governance models, thereby raising the bar on API quality across the organisation.

## When to use these guidelines

These guidelines follow the principles of Representational State Transfer (REST), using HTTP methods and stateless communication between client and server. The guidelines cover these use cases:

- **Internal APIs (Private APIs)**: Used to communicate between different internal systems, services or applications.

- **Public APIs (Open APIs)**: Openly accessible to external developers and users.

- **Partner APIs**: shared with specific external partners but are not openly available to the public. These APIs are typically part of a business agreement, allowing partners to integrate with internal systems or access shared services.

All the above APIs are expected to apply the same guidelines, patterns and standards.

If your product API is based on a different API technology, such as GraphQL or gRPC, this guidance may only partially apply. Further guidance may be provided in future depending on demand.

## How to read the guidelines

The **CAPITALISED** words throughout these guidelines have a special meaning:

The following key words are used throughout this guidance to indicate the strength of each requirement. These are adapted from [RFC2119][1] and contextualised for UKHSA:

1. **MUST**&emsp;This word, or the terms "**REQUIRED**" or "**SHALL**", mean that the requirement is mandatory. It applies universally and must be followed without exception unless formally approved.

1. **MUST NOT**&emsp;This phrase, or the phrase "**SHALL NOT**", mean that this action is explicitly prohibited. It must not be taken under any circumstances unless an approved exception is in place.

1. **SHOULD**&emsp;This word, or the adjective "**RECOMMENDED**", mean that this is a strong recommendation. There may be valid reasons to deviate, but the implications must be understood, justified and documented.

1. **SHOULD NOT**&emsp;This phrase, or the phrase "**NOT RECOMMENDED**", mean that this is a strong recommendation against a practice. Exceptions may exist, but they must be carefully considered, justified and documented.

1. **MAY**&emsp;This word, or the adjective "**OPTIONAL**", mean that this is an optional practice or recommendation. Teams may choose to adopt it based on context, value or preference.

### How to use these guidelines

Each section addresses key aspects of building APIs, including naming conventions, versioning, security, error handling, and documentation.

Here's how to navigate and use these guidelines effectively:

Review the sections on API design, naming conventions, versioning and error handling and create an OpenAPI definition that adheres to these patterns.
Determine your security requirements and apply the recommended authorisation, authentication and security patterns, such as OAuth 2.0, JWTs, and Role-Based Access Control (RBAC).
Ensure your API is well-documented including error scenarios and example responses within the OpenAPI definition.
Use the recommended tools for linting, validating and testing your OpenAPI definition and other aspects of your API.

[1]: https://datatracker.ietf.org/doc/html/rfc2119
