# **MUST** use https protocol only

Servers **MUST** be `https` and no other protocol is allowed.

> [!IMPORTANT]
> For OpenAPI definitions marked with `info.x-api-type: pygeoapi`, the pygeoapi ruleset downgrades this rule to `warn`. See [1].

## Invalid Example

```yaml
servers:
  - url: http://azgw.api.ukhsa.gov.uk/detect/testing/v1
    ...
```

## Valid Example

```yaml
servers:
  - url: https://azgw.api.ukhsa.gov.uk/detect/testing/v1
    ...
```

[UKHSA Guidelines Security][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: ../../api-guidelines/security.md#data-protection
