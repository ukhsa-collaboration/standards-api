# Security

## Data Protection

All APIs **MUST** be exposed using `HTTPS`. This is required to protect credentials and data in transit and applies to all API integrations.

Tokens are sensitive data and **MUST** be kept secret when communicated and stored in client applications.

API inputs **MUST** be validated.

## Authentication

Authentication establishes the identity of a resource owner - i.e. either an end user or an application in system-to-system use cases.

Authentication **MUST** be handled with each request by providing a token along with the request.

APIs **MUST NOT** use HTTP Basic Authentication.

**SHOULD** use [JWT (JSON Web Tokens)](https://jwt.io/introduction), passed in the [Authorization](https://datatracker.ietf.org/doc/html/rfc7235#section-4.2) header using the Bearer scheme to convey authentication data.

> [!NOTE]
> **OpenAPI Definition**
>
> Refer to OpenAPI documentation for the [bearer scheme](https://swagger.io/docs/specification/authentication/bearer-authentication/) when designing the API.

When using JWTs as Bearer tokens, they **MUST** be included in the Authorization header as follows:

``` text
Authorization: Bearer <Base64 URL Encoded JWT content>
```

### OpenID Connect

APIs **SHOULD** use [OpenID Connect](https://openid.net/developers/how-connect-works/) (OIDC) as the identity layer on top of OAuth 2.0 when authentication of end users is required.

### JWT Validation

JWTs **MUST** be signed based on the JSON Web Signature (JWS) standard.

> [!NOTE]
>
> **JWT Validation**
> JWT validation is a [policy](https://learn.microsoft.com/en-us/azure/api-management/validate-jwt-policy) configurable on the APIM Platform that will perform some validation. However, APIs **MUST** still validate the JWT as specified below.

The API **MUST** validate the JWT `signature`, `expiry time`, `issuer`, `audience`, `subject` and `claims` in order to determine whether to grant access.

- **Issuer** (`iss`): Verify that the token was issued by a trusted authority. Check the `iss` claim against your expected issuer.
- **Audience** (`aud`): Ensure that the token was issued for your specific API or service by checking the `aud` claim.
- **Expiration Time** (`exp`)/**Not Before Time** (`nbf`): Ensure that the token has not expired by checking the `exp` and `nbf` claims, which are Unix timestamps.
- **Subject** (`sub`): Check the `sub` claim to ensure the token belongs to the expected user.
- **Custom Claims**: If the token includes any custom claims (e.g., roles, permissions), verify them according to your application's logic.

**MUST NOT** put secret information inside the JWT token that uses the JWS standard.

JWT expiration for interactive end-user applications **SHOULD** be between 1 and 60 minutes.

> [!WARNING]
> **Security Note**
>
> Review the OWASP API guidelines on [Broken Authentication](https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/) and ensure relevant guidance is followed.

## Authorisation

[OAuth 2.0](https://oauth.net/2/) provides authorisation of a client application via an access token. In end user use cases, authorisation is delegated from the user, whereas in system-to-system use cases client are authorised on their own behalf.

Authorisation **MUST** be handled with each request by providing a token along with the request.

APIs **SHOULD** use OAuth 2.0 for authorisation. Using OAuth 2.0 will provide the greatest compatibility with API consumers as it is a widely adopted standard. The following authorisation use cases are supported:

| Use Case                       |                                                                                                                                                           | Grant Type          | Extensions    |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|---------------|
| End User (confidential client) | For interactive authorisation where the authentication of a user is required and the client secret can be kept confidential within the backend service.   | [Authorization Code](https://oauth.net/2/grant-types/authorization-code/)<br><br>[Refresh Token](https://oauth.net/2/grant-types/refresh-token/) (**MAY**) | PKCE (**SHOULD**) |
| End User (public client)       | For interactive authorisation where the authentication of a user is required and the client secret CANNOT be kept confidential in the client application. | [Authorization Code](https://oauth.net/2/grant-types/authorization-code/)<br><br>[Refresh Token](https://oauth.net/2/grant-types/refresh-token/) (**MAY**) | PKCE (**MUST**)   |
| System-to-System               | For non-interactive authorisation outside of the context of a user                                                                                        | [Client Credentials](https://oauth.net/2/grant-types/client-credentials/) | |

APIs **SHOULD NOT** use the "[Resource Owner Password Credentials Grant](https://oauth.net/2/grant-types/password/)" or "[Implicit Grant](https://oauth.net/2/grant-types/implicit/)", which are considered legacy and have been deprecated from OAuth 2.1 as they are considered weak from a security standpoint.

> [!NOTE]
>
> Refer to OpenAPI documentation for [OAuth 2.0](https://swagger.io/docs/specification/authentication/oauth2/) when designing the API.

### OAuth 2.0 Authorization Code Grant Type

- **SHOULD** use OAuth 2.0 `Authorization Code` grant type for interactive authorisation where the authentication of a user is required.
- **SHOULD** use `PKCE` extension for enhanced security with confidential clients (e.g. backend service).
**MAY** use refresh tokens with `Authorization Code` grant type.
- **MUST** use `Authorization Code` grant + `PKCE` with non-confidential (public) clients (e.g. single page web or mobile applications). Note that mobile applications can be reverse engineered to extract client secrets.

### Client Credentials Grant Type

- **SHOULD** use OAuth 2.0 `Client Credentials` grant type for non-interactive (machine-to-machine) authorisation outside of the context of a user.

- **SHOULD** define permissions using OAuth 2.0 scopes.

- **SHOULD NOT** use refresh tokens with `Client Credentials` grant type.

TODO:

Scopes and permissions using OAuth 2.0 scopes

> [!WARNING]
>
> **Security Note**
> Review the OWASP guidelines on [Broken Function Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/) and ensure relevant guidance is followed.

## Access Control

### Role-Based Access Control (RBAC)

TODO

> [!WARNING]
>
> **Security Note**
> Review the OWASP guidelines on [Broken Function Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/) and ensure relevant guidance is followed.

## Rate Limiting

TODO
