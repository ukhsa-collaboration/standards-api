# **SHOULD** support `application/json` content request body

Note: Run Vacuum with `--resolve-refs` to resolve `$ref` before rules run. Use `--resolve-nested-refs` to resolve nested `$ref` values relative to their own document context. Both flags still honor `--remote` and `--base` for external lookups.
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
