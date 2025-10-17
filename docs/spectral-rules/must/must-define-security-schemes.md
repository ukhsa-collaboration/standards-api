# **MUST** define security schemes

All APIs **MUST** have a security scheme defined.

> [!IMPORTANT]
> For openapi definitions marked with `info.x-api-type: pygeoapi`, this rule’s severity is automatically set to `warn` by the `override-severity-pygeoapi` rule. See [1].

If an API doesn't have a security scheme defined, it means the entire API is open to the public. That's probably not what you want, even if all the data is read-only. Setting lower rate limits for the public and letting known consumers use more resources is a handy path to monetization, and helps know who your power users are when changes need feedback or migration, even if not just good practice.

## Valid Example

```yaml
components:
  securitySchemes:
    oAuth:
      type: oauth2
      description: This API uses OAuth 2 with the authorization code flow. [More info](https://oauth.net/2/grant-types/authorization-code/)
      flows:
        authorizationCode:
          authorizationUrl: https://domain.test/api/oauth/dialog
          tokenUrl: https://domain.test/api/oauth/token
          refreshUrl: https://domain.test/api/oauth/token
          scopes:
            tests:read: read test results
            tests:write: submit test results
```

[UKHSA Guidelines Security][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: ../../api-guidelines/security.md#authentication
