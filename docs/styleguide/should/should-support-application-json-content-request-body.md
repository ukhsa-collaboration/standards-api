# **SHOULD** support `application/json` content request body

Every request **SHOULD** support at least `application/json` media type.

## Valid Example

```yaml
paths:
  /results:
    ...
    post:
      summary: Submit a new test result
      description: Submit a new test result.
      operationId: submitResult
      tags:
        - results
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ResultRequest'
```
