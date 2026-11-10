# **MUST** use URI versioning

Paths in the source OpenAPI document **MUST** contain an exact `MAJOR` version segment before the resource unless the version is already present at the end of every `servers[].url`. Any base prefix before the version, such as `/api`, **MUST** be identical across all paths.

APIM adds the published `/namespace/product` prefix. Source paths may therefore start directly with the version, such as `/v1/users`, or use a consistent application base, such as `/api/v1/users`.

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

Consistent base prefix before the version:

```yaml
/api/v1/users:
/api/v1/projects:
```

Version in the server URL:

```yaml
servers:
  - url: https://api.example.com/v1
paths:
  /users:
```

The published path may then be `/namespace/product/v1/users` after APIM adds its prefix.

[UKHSA Guidelines Versioning][versioning-guideline]

[versioning-guideline]: ../../api-guidelines/versioning-and-deprecation.md#uri-versioning
