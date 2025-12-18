# **MUST** use https protocol only

Servers **MUST** be `https` and no other protocol is allowed.

> [!IMPORTANT]
> For openapi definitions marked with `info.x-api-type: pygeoapi`, this rule’s severity is automatically set to `warn` by the `override-severity-pygeoapi` rule. See [1].

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
