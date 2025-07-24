---
order: 7
---
# Versioning and Deprecation

## URI versioning

**MUST** use URI (path-based) versioning.

API versions **MUST** start with v1.

The version number **MUST** be placed consistently at the base of the api path.

Version numbers **MUST NOT** be passed as parameters.

> [!TIP] Use
> ``` text
> /product/v1/users
> /product/v2/users
> ```

> [!CAUTION] Avoid
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

> [!TIP] Use
>
> ``` text
> /product/v1/users
> ```

Avoid:

> [!CAUTION] Avoid
>
> ``` text
> /product/v1.0.1/users
> ```

`MINOR` and `PATCH` versions **MUST NOT** be added to the URI as they do not affect compatibility.

## API root endpoint

There **SHOULD** be an endpoint to return version metadata (typically the APIs root `/` endpoint) that is also documented in the OpenAPI definition, not only will this provide useful API metadata but will help API consumers know they're looking at the right place instead of getting a `404` or random `500` error as is common in some APIs.

``` text
GET /namespace/product/v1

{
  "name": "Product API",
  "version": "1.0.1"
  "status": "LIVE"
  "releaseDate": "2024-09-17"
  "documentation": "https://developer.ukhsa.gov.uk/namespace/product/v1/docs"
  "releaseNotes": "https://developer.ukhsa.gov.uk/namespace/product/v1/releaseNotes"
}
```

## Compatibility

**MUST** provide a new API `MAJOR` version number for changes that alter the API contract, such as changes to resource structure, new required parameters, or significant behavioural changes.

Non-breaking changes, such as adding optional fields, new endpoints, or improving performance **MUST NOT** increment the version number.

**SHOULD** maintain backwards compatibility where possible.

## Deprecation

**MUST** deprecate old API versions and document API deprecation status

**MUST** document when older API versions will be deprecated and eventually retired in the OpenAPI definition.

## Communication

**SHOULD** notify API consumers of upcoming changes.
