---
order: 2
---

# API Specification & Documentation

The [OpenAPI specification][1] (OAS; formerly known as Swagger) is a widely adopted standard for describing REST APIs. It provides a machine-readable format for defining API endpoints, request/response schemas, and security configurations.

Using the OpenAPI Specification to create an OpenAPI definition is an essential design output when developing your API. The definition can be created in a simple text editor, integrated development environment (IDE), or using a dedicated tool such as [Swagger Editor][2].

A sample OpenAPI definition based on these guidelines can be viewed [here][3].

## Generating code from OpenAPI definitions

The OpenAPI definition can be used to generate client and server code, including data transfer (DTOs) and service objects (implementation stubs). [The OpenAPI Generator][4] project supports a number of programming languages, frameworks and toolchains for this purpose.

Consider using these tools to accelerate development and testing.

## Validating API requests against OpenAPI definitions

Tools exist for validating JSON REST content against OpenAPI definitions as part of testing. For example, the [swagger-request-validator][5] is an open source (Apache 2.0 licensed) validator.

## Example responses & mock responses

Provide example responses in the OpenAPI definition. Examples will allow clients see what a small sample of the data returned by the API looks like, which will avoid ambiguity and accelerate development.

[1]: https://swagger.io/specification/
[2]: https://editor.swagger.io/
[3]: https://github.com/ukhsa-collaboration/api-guidelines/blob/main/example/example.1.0.0.oas.yml
[4]: https://openapi-generator.tech/
[5]: https://bitbucket.org/atlassian/swagger-request-validator/src/master/
