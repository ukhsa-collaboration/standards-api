# Versioning and Deprecation

## URI versioning

**MUST** use URI (path-based) versioning.

API versions **MUST** start with v1.

The version number **MUST** be placed consistently at the base of the api path.

Version numbers **MUST NOT** be passed as parameters.

Use:

> [!TIP]
>
> ``` text
> /product/v1/users
> /product/v2/users
> ```

Avoid:

> [!CAUTION]
>
> ``` text
> /product/users/v2
> /product/users?v=1
> ```

## Semantic versioning

**MUST** use semantic versioning:

``` text
version = {MAJOR}.{MINOR}.{PATCH}
```

- `MAJOR` version when you make incompatible API changes
- `MINOR` version when you add functionality in a backward compatible manner
- `PATCH` version when you make backward compatible bug fixes

For example: `1.0.1 (MAJOR = 1, MINOR = 0, PATCH = 1)`

The semantic version represents the build version of the application.

**MUST** use only `MAJOR` version in URIs, formatter as the simple numeric `MAJOR` versions, prefixed with 'v' (e.g. `v1`, `v2`):

Use:

> [!TIP]
>
> ``` text
> /product/v1/users
> ```

Avoid:

> [!CAUTION]
>
> ``` text
> /product/v1.0.1/users
> ```

`MINOR` and `PATCH` versions **MUST NOT** be added to the URI as they do not affect compatibility.

There **SHOULD** be an endpoint to return version metadata that is also documented in the OpenAPI specification.

``` text
GET /namespace/product/v1
 
{
  "name": "product",
  "version": "1.0.1"
  "release_date": "2024-09-17"
  "documentation": "https://developer.ukhsa.gov.uk/namespace/product/v1/docs"
  "status": "deprecated"
}
```

## Compatibility

**MUST** provide a new API `MAJOR` version number for changes that alter the API contract, such as changes to resource structure, new required parameters, or significant behavioural changes.

Non-breaking changes, such as adding optional fields, new endpoints, or improving performance **MUST NOT** increment the version number.

## Deprecation

**MUST** deprecate old API versions and document API deprecation status

**MUST** document when older API versions will be deprecated and eventually retired in the OpenAPI specification.
