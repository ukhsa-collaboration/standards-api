# **MUST** use https protocol only

Servers **MUST** be `https` and no other protocol is allowed.

## Invalid Example

``` yaml
servers:
  - url: http://azgw.api.ukhsa.gov.uk/detect/testing/v1
    ...
```

## Valid Example

``` yaml
servers:
  - url: https://azgw.api.ukhsa.gov.uk/detect/testing/v1
    ...
```

[UKHSA Guidelines Security](../../api-guidelines/security.md#data-protection)
