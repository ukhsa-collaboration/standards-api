# API Design

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

| Method  | Safe? | Is idempotent? | Is cacheable? |
|---------|-------|----------------|---------------|
| GET     | Yes   | Yes            | Optional      |
| HEAD    | Yes   | Yes            | Optional      |
| POST    | No    | No             | No            |
| PUT     | No    | Yes            | No            |
| PATCH   | No    | No             | No            |
| DELETE  | No    | Yes            | No            |
| OPTIONS | Yes   | Yes            | No            |

Safe methods have no side affects (i.e. using the method does not alter data).

Idempotent methods can be be executed multiple times with the same result as executing once.
