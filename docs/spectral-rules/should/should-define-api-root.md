# **SHOULD** define api root

APIs **SHOULD** have a root path (`/`) defined.

Good documentation is always welcome, but API consumers **SHOULD** be able to get a pretty long way through interaction with the API alone. They **SHOULD** at least know they're looking at the right place instead of getting a 404 or random 500 error as is common in some APIs.

## Valid Example

``` yaml
paths:
  /:
    get:
      summary: Get API information.
      description: Get API information.
      operationId: getApiInfo
      tags:
        - API Meta Information
      responses:
        '200':
          description: This response returns a information about the API.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiInfo'
        default:
          $ref: '#/components/responses/UnexpectedError'
```

[UKHSA Guidelines Versioning](../../api-guidelines/versioning-and-deprecation.md#api-root-endpoint)
