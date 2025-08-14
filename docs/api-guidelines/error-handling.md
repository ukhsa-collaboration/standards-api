---
order: 6
---

# Error Handling

## Problem Details

APIs **MUST** conform to the [RFC-9457][1] standard "Problem Details for HTTP APIs" which defines a structured way for expressing error details in HTTP APIs.

APIs **MUST** use the appropriate content type `application/problem+json` or `application/problem+xml` (depending on the format bring returned) when returning the Problem Details response object.

Problem Details responses **MUST** be described in the APIs open api specification.

A Problem Detail response **MUST NOT** contain a program stack trace or server log for debugging purposes, instead consider an extended member such as `traceId` as described below.

You **MUST** include all the base Problem Details members: `status`, `title`, `detail`, `type` and `instance`.

## Required Error Responses

> [!NOTE] Warning
> The requirements in this section are **MUST**s as per the guidelines. However, the current Spectral rule severity is set to *warning* rather than *error*, so existing APIs are not forced to implement these changes immediately, as doing so may constitute a breaking change.

Operations in the OpenAPI specification **MUST** include the following standard Problem Details responses:

- `400 Bad Request`
- `404 Not Found`
- `500 Internal Server Error`

Each response **MUST** include at least one example.

If an operation inherits or has its **own non-empty `security` block**, it **MUST** define:

- `401 Unauthorized`
- `403 Forbidden`

### Extended Details

As per the [RFC-9457][1] you **MAY** extend the Problem Details object to include additional context/information that are specific to the problem type.

There are some common extension members such as `traceId`, `errors` and `code` which are useful and so you should consider including them.

| Extension Member | Include | Detail |
| - | :-: | - |
| `traceId` | **MAY** | Can be used to find any [distributed traces and logs][2] for the current request. |
| `errors` | **MAY** | When you want to respresent multiple validation errors from a single request. |
| `code` | **MAY** | An API specific error code aiding the provider team understand the error based on their own potential taxonomy or registry. |

If an API extends their Problem Details object to include API specific error codes i.e. adding `code` as an extension, then the API specific error codes **MUST** be documented in the OpenAPI definition.

The [MOT history API][3] and [NHS Spine Core API Framework][4] provides a useful example for standardising API specific error codes. While UKHSA's context may differ, a similar approach can be adopted while still adhering to [RFC-9457][1].

## Common Problems Registry

[RFC-9457][1] has the concept of a [registry][5] for common problems, given that the intended use for these API Design Guidelines is for an APIM Platform, a **single** shared registry of Problem Details **MAY** be created or an existing registry adopted (as long as there aren't multiple registries) for common responses.

This should prevent redefining the same common responses for each new API and encourage consistency which is especially helpful for consumers of multiple APIs on the platform.

An example Problem Details registry with usage examples can be found [here][6] and the corresponding OpenAPI components file [here][7]; This can be achieved in OpenAPI through the use of the [`$ref`][8] keyword and referencing a URL which contains the shared OpenAPI components.

### `$ref` usage example

```yaml
paths:
  /namespace/product/v1/patients:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Result'
                title: GetResultsListOk
          description: A JSON array containing results objects.
        '404':
          $ref: 'https://developer.ukhsa.gov.uk/openApi/common#/components/responses/NotFound'
        default:
          $ref: 'https://developer.ukhsa.gov.uk/openApi/common#/#/components/responses/UnexpectedError'
```

```yaml
# https://developer.ukhsa.gov.uk/openApi/common contents
...
components:
  responses:
    UnexpectedError:
      description: An unexpected error occurred.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
          examples:
            unauthorized:
              $ref: '#/components/examples/unauthorized'
            forbidden:
              $ref: '#/components/examples/forbidden'
            not-found:
              $ref: '#/components/examples/not-found'
            server-error:
              $ref: '#/components/examples/server-error'
...
```

> [!NOTE]
> Refer to [RFC-9547][1] standard for additional information.

## Example Responses

### 400 Bad Request - Single Error

```text
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1",
  "status": 400,
  "title": "Bad Request",
  "detail": "Invalid rquest, 'nhsNumber' is required.",
  "instance": "POST /namespace/product/v1/patients",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

### 400 Bad Request - Multiple Errors

```text
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.1",
  "status": 400,
  "title": "Bad Request",
  "detail": "Invalid rquest, see errors.",
  "errors": [{
    "detail": "'nhsNumber' is required.",
    "pointer": "#/nhsNUmber"
   },
  {
    "detail": "'firstName' is required.",
    "pointer": "#/firstName"
  }]
  "instance": "POST /namespace/product/v1/patients",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

### 401 Unauthorized

```text
HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.2",
  "status": 401,
  "title": "Unauthorized",
  "detail": "Access token not set or invalid. The requested resource could not be returned",
  "instance": "GET /namespace/product/v1/patients/12345",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

### 403 Forbidden

```text
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.4",
  "status": 403,
  "title": "Forbidden",
  "detail": "The resource could not be returned as the requestor is not authorized",
  "instance": "GET /namespace/product/v1/patients/12345",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

### 404 Not Found

```text
HTTP/1.1 404 Not Found
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.5.5",
  "status": 404,
  "title": "Not Found",
  "detail": "The requested resource was not found",
  "instance": "GET /namespace/product/v1/patients/12345",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

### 500 Internal Server Error

```text
HTTP/1.1 500 Internal Server Error
Content-Type: application/problem+json
 
{
  "type": "https://datatracker.ietf.org/doc/html/rfc9110#section-15.6.1",
  "status": 500,
  "title": "Internal Server Error",
  "detail": "The server encountered an unexpected error",
  "traceId": "00-63d4af1807586b0d98901ae47944192d-9a8635facb90bf76-01"
}
```

[1]: https://www.rfc-editor.org/rfc/rfc9457.html
[2]: https://aws.amazon.com/what-is/distributed-tracing/
[3]: https://documentation.history.mot.api.gov.uk/mot-history-api/error-codes/
[4]: https://digital.nhs.uk/services/gp-connect/develop-gp-connect-services/development/error-handling#top
[5]: https://www.rfc-editor.org/rfc/rfc9457.html#registry
[6]: https://problems-registry.smartbear.com/
[7]: https://api.swaggerhub.com/domains/smartbear-public/ProblemDetails/1.0.0
[8]: https://swagger.io/docs/specification/v3_0/using-ref/
