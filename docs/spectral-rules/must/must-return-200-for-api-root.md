# **MUST** return 200 for api root

Root path **MUST** define a `200` response.

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
