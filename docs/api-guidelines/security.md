---
order: 5
---

# Security

## Data Protection

All APIs **MUST** be exposed using `HTTPS`. This is required to protect credentials and data in transit and applies to all API integrations.

Tokens are sensitive data and **MUST** be kept secret when communicated and stored in client applications.

API inputs **MUST** be validated.

## Authentication

Authentication establishes the identity of a resource owner - i.e. either an end user or an application in system-to-system use cases.

Authentication **MUST** be handled with each request by providing a token along with the request.

APIs **MUST NOT** use HTTP Basic Authentication.

**SHOULD** use [JWT (JSON Web Tokens)][1], passed in the [Authorization][2] header using the Bearer scheme to convey authentication data.

> [!NOTE]
> **OpenAPI Definition**
>
> Refer to OpenAPI documentation for the [bearer scheme][3] when designing the API.

When using JWTs as Bearer tokens, they **MUST** be included in the Authorization header as follows:

```text
Authorization: Bearer <Base64 URL Encoded JWT content>
```

### OpenID Connect

APIs **SHOULD** use [OpenID Connect][4] (OIDC) as the identity layer on top of OAuth 2.0 when authentication of end users is required.

### JWT Validation

JWTs **MUST** be signed based on the JSON Web Signature (JWS) standard.

> [!NOTE]
>
> **JWT Validation**
> JWT validation is a [policy][5] configurable on the APIM Platform that will perform some validation. However, APIs **MUST** still validate the JWT as specified below.

The API **MUST** validate the JWT `signature`, `expiry time`, `issuer`, `audience`, `subject` and `claims` in order to determine whether to grant access.

- **Issuer** (`iss`): Verify that the token was issued by a trusted authority. Check the `iss` claim against your expected issuer.
- **Audience** (`aud`): Ensure that the token was issued for your specific API or service by checking the `aud` claim.
- **Expiration Time** (`exp`)/**Not Before Time** (`nbf`): Ensure that the token has not expired by checking the `exp` and `nbf` claims, which are Unix timestamps.
- **Subject** (`sub`): Check the `sub` claim to ensure the token belongs to the expected user.
- **Custom Claims**: If the token includes any custom claims (e.g., `roles`, `permissions`), verify them according to your application's logic.

**MUST NOT** put secret information inside the JWT token that uses the JWS standard.

JWT expiration for interactive end-user applications **SHOULD** be between 1 and 60 minutes.

> [!WARNING]
> **Security Note**
>
> Review the OWASP API guidelines on [Broken Authentication][6] and ensure relevant guidance is followed.

## Authorisation

[OAuth 2.0][7] provides authorisation of a client application via an access token. In end user use cases, authorisation is delegated from the user, whereas in system-to-system use cases client are authorised on their own behalf.

Authorisation **MUST** be handled with each request by providing a token along with the request.

APIs **SHOULD** use OAuth 2.0 for authorisation. Using OAuth 2.0 will provide the greatest compatibility with API consumers as it is a widely adopted standard. The following authorisation use cases are supported:

| Use Case | | Grant Type | Extensions |
| - | - | - | - |
| End User (confidential client) | For interactive authorisation where the authentication of a user is required and the client secret can be kept confidential within the backend service. | [Authorization Code][8]<br><br>[Refresh Token][9] (**MAY**) | PKCE (**SHOULD**) |
| End User (public client) | For interactive authorisation where the authentication of a user is required and the client secret CANNOT be kept confidential in the client application. | [Authorization Code][8]<br><br>[Refresh Token][9] (**MAY**) | PKCE (**MUST**) |
| System-to-System | For non-interactive authorisation outside of the context of a user | [Client Credentials][10] | |

APIs **SHOULD NOT** use the "[Resource Owner Password Credentials Grant][11]" or "[Implicit Grant][12]", which are considered legacy and have been deprecated from OAuth 2.1 as they are considered weak from a security standpoint.

> [!NOTE]
>
> Refer to OpenAPI documentation for [OAuth 2.0][13] when designing the API.

### OAuth 2.0 Authorization Code Grant Type

- **MUST** use `Authorization Code` grant + `PKCE` with non-confidential (public) clients (e.g. single page web or mobile applications). Note that mobile applications can be reverse engineered to extract client secrets.
- **SHOULD** use OAuth 2.0 `Authorization Code` grant type for interactive authorisation where the authentication of a user is required.
- **SHOULD** use `PKCE` extension for enhanced security with confidential clients (e.g. backend service).
- **SHOULD** define access control using [OAuth 2.0 Scopes][14].
- **MAY** use refresh tokens with `Authorization Code` grant type.

#### OAuth 2.0 Scopes

[OAuth 2.0 scopes][15] are used to specify the permissions that a client application is requesting from a resource owner (API) on behalf of a user. Scopes allow for granular access control and help protect sensitive data by limiting the access granted to applications. The application isn't able to access anything the signed in user couldn't access.

The client application is only able access the resources that the user can personally access, typically the user's resources or resources related to the user.

As with many things in software development defining scopes is a trade-off between flexibility and complexity. Scopes can be defined at different levels of granularity, from broad permissions to very specific actions.

See [Defining Scopes][16] for insight into defining OAuth 2.0 scopes.

##### Common Scope Patterns

A common scope naming convention is `resource.operation.constraint`.

- `{resource}.Read.All`: Read-only access to a resource
- `{resource}.Write.All`: Write access to a resource
- `{resource}.ReadWrite.All`: Both read and write access

If your API exposes Employee Resources then example scope might look like this `Employees.Read.All` for read access and `Employees.Write.All` for write access.

> [!NOTE]
> When using the Entra ID (previously Azure AD) identity platform, review [Microsoft Developer Glossary][17] for its [Scope definition][18] and [Microsoft Graph API Permission Scopes][19] for scope examples.

### Client Credentials Grant Type

- **SHOULD** use OAuth 2.0 `Client Credentials` grant type for non-interactive (machine-to-machine) authorisation outside of the context of a user.
- **SHOULD** consider a mechanism for [Access Control][20] in the absence of scopes.
- **SHOULD NOT** use refresh tokens with `Client Credentials` grant type.

> [!WARNING]
>
> **Security Note**
> Review the OWASP guidelines on [Broken Function Level Authorization][21] and ensure relevant guidance is followed.

#### Access Control

Access control is the process of determining whether a user or application has permission to access a resource or perform an action.

There are 2 scenarios for access control:

1. **Delegated Access**: This scenario involves a user authenticating (typically using `Authorization Code flow`) and granting permission (consent) to an application to act on their behalf. The application receives a token that includes the user's context and permissions, delegated permissions can also be referred to as [scopes][14].

1. **Application Access**: In this scenario, an application authenticates using its own credentials (`client credentials`) and is granted permissions to access resources without a user context.

For an overview on access control and deciding when to use [Delegated][22] and or [Application][23] access with Azure Entra ID (previously Azure AD), refer to [Microsoft Entra ID Permissions and Consent Overview][24].

#### Role-Based Access Control (RBAC)

- APIs **SHOULD** consider implementing Role-Based Access Control (RBAC) to govern access to protected resources.
- RBAC **MUST** be implemented at the API level, not just at the UI level. This ensures that all access control decisions are enforced regardless of how the API is accessed.
- APIs **SHOULD** define a set of roles with clear and distinct permissions that align with business functions.
- Role information **SHOULD** be included in the JWT token as claims (e.g., `roles` or `groups`).

> [!NOTE]
> When using the Entra ID (previously Azure AD) identity platform, review [Microsoft Developer Glossary][17] for its [Roles definition][25]. App Roles can be [defined in the application manifest and assigned to users and groups][26].
>
> The Entra ID identity platform app roles utilises the `roles` claim in the JWT token.

- APIs **MUST** validate `role` claims on each request to ensure the caller has appropriate permissions for the requested operation.

- Role assignments **SHOULD** be managed through a centralised identity management system rather than within individual APIs.

For fine-grained access control:

- APIs **SHOULD** implement permission checks at both resource and operation levels.
- APIs **SHOULD** validate not only that the consumer has the correct role, but also that they have access to the specific resource instance being manipulated.
- APIs **SHOULD** implement the principle of least privilege, granting only the minimum access necessary.

#### Role Naming Conventions

When defining roles, consider using a naming convention that reflects the business function or operation. This helps in understanding the purpose of each role.

A common pattern is to use a verb-noun format (e.g., `Employee.Read`, `Manager.Create`) to indicate the permitted action and the resource being acted upon.

## Rate Limiting

Rate limiting controls the number of API requests a client can make within a specific time period to protect the API from abuse, denial of service attacks, and to ensure fair usage.

> [!WARNING]
> **Security Note**
>
> Review the OWASP API Security Top 10 guidance on [Lack of Resources & Rate Limiting][27] and ensure relevant controls are implemented.

APIs **SHOULD** implement rate limiting to:

- Protect against denial-of-service attacks
- Prevent abusive behaviour from legitimate clients
- Ensure fair resource allocation among all consumers
- Maintain service availability during traffic spikes

Rate limits **SHOULD** be clearly documented in the API documentation, including:

- Request limits (e.g., requests per minute/hour/day)
- How limits are calculated (per API key, IP address, user, etc.)
- Consequences of exceeding limits

### Rate Limit Headers

When a client makes a request, the API **SHOULD** include the following HTTP headers in responses:

- `X-RateLimit-Limit`: Maximum number of requests allowed in a time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current time window
- `X-RateLimit-Reset`: Time (in seconds or timestamp) when the rate limit window resets

### Rate Limit Responses

When a client exceeds the rate limit, the API **MUST** return:

- HTTP status code `429 Too Many Requests`
- A response body explaining the rate limit was exceeded
- A `Retry-After` header indicating when the client can retry

#### Example response

```text
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1609459200
Retry-After: 60

{
  "type": "https://datatracker.ietf.org/doc/html/rfc6585#section-4",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit is exceeded. Try again in 60 seconds.",
  "instance": "POST /namespace/product/v1/patients"
}
```

### Rate Limiting Strategies

APIs **SHOULD** consider implementing one or more of the following rate limiting strategies:

- **Fixed Window**: Limits requests in fixed time intervals (e.g., 100 requests per hour)
- **Sliding Window**: Tracks requests over a moving time period for smoother traffic management
- **Token Bucket**: Allocates tokens that are consumed with each request and replenished over time
- **Concurrency Limiting**: Restricts the number of concurrent requests rather than the rate

### Tiered Rate Limits

APIs **MAY** implement tiered rate limits based on:

- Client identity or subscription level
- API endpoint sensitivity (higher limits for low-risk operations)
- Time of day or expected traffic patterns

> [!NOTE]
> When using Azure API Management, consider using the [rate-limit policy][28] or [quota policy][29] to implement rate limiting.

[1]: https://jwt.io/introduction
[2]: https://datatracker.ietf.org/doc/html/rfc7235#section-4.2
[3]: https://swagger.io/docs/specification/authentication/bearer-authentication/
[4]: https://openid.net/developers/how-connect-works/
[5]: https://learn.microsoft.com/en-us/azure/api-management/validate-jwt-policy
[6]: https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/
[7]: https://oauth.net/2/
[8]: https://oauth.net/2/grant-types/authorization-code/
[9]: https://oauth.net/2/grant-types/refresh-token/
[10]: https://oauth.net/2/grant-types/client-credentials/
[11]: https://oauth.net/2/grant-types/password/
[12]: https://oauth.net/2/grant-types/implicit/
[13]: https://swagger.io/docs/specification/authentication/oauth2/
[14]: #oauth-20-scopes
[15]: https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
[16]: https://www.oauth.com/oauth2-servers/scope/defining-scopes/
[17]: https://learn.microsoft.com/en-us/entra/identity-platform/developer-glossary
[18]: https://learn.microsoft.com/en-us/entra/identity-platform/developer-glossary#scopes
[19]: https://learn.microsoft.com/en-us/graph/permissions-reference
[20]: #access-control
[21]: https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/
[22]: https://learn.microsoft.com/en-us/entra/identity-platform/delegated-access-primer
[23]: https://learn.microsoft.com/en-us/entra/identity-platform/app-only-access-primer
[24]: https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview
[25]: https://learn.microsoft.com/en-us/entra/identity-platform/developer-glossary#roles
[26]: https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps
[27]: https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
[28]: https://learn.microsoft.com/en-us/azure/api-management/rate-limit-policy
[29]: https://learn.microsoft.com/en-us/azure/api-management/quota-policy
