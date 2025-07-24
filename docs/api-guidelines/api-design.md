---
order: 3
---
# API Design

## API-First

**SHOULD** follow the API-first approach to designing the API, as it prioritises the API contract from the very beginning, leading to the development of APIs which are more consistent, standardised and reusable.

## RESTful API Style

**SHOULD** use the HTTP REST API style.

REST APIs **MUST** be stateless by design.

## REST Maturity Levels

The Richardson Maturity Model defines levels of maturity for RESTful APIs, ranging from basic usage of HTTP to fully REST-compliant APIs.

APIs **MUST** use at least `Maturity Level 2`.

At this level, APIs not only define resources with URIs but also correctly use `HTTP methods` to perform actions on these resources. The interaction follows `REST` principles more closely, with specific verbs (`GET`, `POST`, `PUT`, `DELETE`) representing different actions.

- Resources **MUST** be identified with distinct URIs
- Standard HTTP methods **MUST** be used correctly
- The API **MUST** use standard HTTP status codes for responses

APIs **MAY** use `Maturity Level 3` - Hyper Media Controls (HATEOAS).

## HTTP Methods & Semantics

APIs **MUST** use the appropriate HTTP method to perform operations on resources:

- `GET`: Retrieve a resource or a collection of resources.
- `POST`: Create a new resource.
- `PUT`: Update an existing resource, typically replacing it.
- `PATCH`: Partially update an existing resource.
- `DELETE`: Remove a resource.

APIs **SHOULD** observe standard method semantics:

- [Safe methods](https://datatracker.ietf.org/doc/html/rfc9110#section-9.2.1) have no side affects (i.e. using the method does not alter data).
- [Idempotent methods](https://datatracker.ietf.org/doc/html/rfc9110#section-9.2.2) can be be executed multiple times with the same result as executing once.
- [Cacheable methods](https://datatracker.ietf.org/doc/html/rfc9110#section-9.2.3) indicate responses can be cached / stored for future reuse.

Method implementations must fulfill the following basic properties according to [RFC9110 Section 9.2](https://datatracker.ietf.org/doc/html/rfc9110#section-9.2):

| Method    | Safe? | Is idempotent? | Is cacheable? |
|-----------|-------|----------------|---------------|
| `GET`     | Yes   | Yes            | Optional      |
| `HEAD`    | Yes   | Yes            | Optional      |
| `POST`    | No    | No             | No            |
| `PUT`     | No    | Yes            | No            |
| `PATCH`   | No    | No             | No            |
| `DELETE`  | No    | Yes            | No            |
| `OPTIONS` | Yes   | Yes            | No            |
| `TRACE`   | Yes   | Yes            | No            |

## Response Format

APIs **SHOULD** accept and return valid [JSON](https://datatracker.ietf.org/doc/html/rfc8259) as the standard default data interchange format.

APIs **MAY** use the [json.api](https://jsonapi.org/) specification.

APIs **MAY** use standard representations defined in specifications such as [FHIR UK Core](https://digital.nhs.uk/services/fhir-uk-core) where required but **SHOULD** use the JSON formats where they are defined.

APIs **SHOULD** return JSON objects as top-level data structures and not return JSON arrays at the top level.

## Content Negotiation

The API **MUST** indicate the format of the response using the Content-Type header.

```text
Content-Type: application/json
```

APIs **MAY** return additional representations, such as XML, if supported and requested by content negotiation via the Accept header.

Supported content types **MUST** be documented in the OpenAPI specification.

## REST HTTP Response Codes

APIs **MUST** use standard HTTP response codes

Use [standard HTTP status codes](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml) to indicate the result of the operation. For example:

- **200 OK**, for a successful `GET` or `PUT` request.
- **201 Created**, for a successful `POST` request that results in resource creation.
- **204 No Content**, for a successful `DELETE` request.
- **400 Bad Request**, for a request with invalid data.
- **404 Not Found**, if the resource does not exist.
- **500 Internal Server Error**, for server-side issues.

`201 Created` responses to `POST` methods **SHOULD** have a `Location` header identifying the location of the newly created resource according to [RFC9110 Section 10.2.2](https://datatracker.ietf.org/doc/html/rfc9110#section-10.2.2).

For detailed requirements on standardised error responses (e.g., 401, 403, 500) using Problem Details (RFC-9457), see [UKHSA Guidelines Error Handling](./error-handling.md).
