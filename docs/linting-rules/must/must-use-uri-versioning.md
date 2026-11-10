# **MUST** use URI versioning

Paths in the source OpenAPI document **MUST** start with a `MAJOR` version segment unless the version is already present at the end of every `servers[].url`. APIM adds the published `/namespace/product` prefix, so it is not included before the version in source paths.

A fixed base such as `/api` belongs in the server URL. For example, use `https://api.example.com/api/v1` with source paths such as `/projects`, rather than `/api/v1/projects`.

## Invalid Examples

```yaml
/users:
```

```yaml
/users/v1:
```

```yaml
/v1beta/users:
```

## Valid Examples

Version in the source path:

```yaml
/v1/users:
```

Version in the server URL:

```yaml
servers:
  - url: https://api.example.com/v1
paths:
  /users:
```

The published path may then be `/namespace/product/v1/users` after APIM adds its prefix.

<a href="../../api-guidelines/versioning-and-deprecation.md#uri-versioning">UKHSA Guidelines Versioning</a>
