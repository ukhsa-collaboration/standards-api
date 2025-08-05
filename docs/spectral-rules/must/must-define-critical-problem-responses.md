# **MUST** define 400, 404, and 500 responses

Every operation **MUST** define 400, 404, and 500 responses and include at least one example.
This ensures proper client error handling
as per [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).

## Invalid Example

```yaml
responses:
  '400':
    description: Bad request
  '500':
    $ref: '#/components/responses/UnexpectedError'
```

## Valid Example

``` yaml
responses:
  '400':
    description: Bad request
    content:
      application/problem+json:
        schema:
          $ref: '#/components/schemas/ProblemDetails'
        examples:
          missing-param:
            summary: Missing parameter
            value:
              title: "Missing parameter"
              status: 400
              detail: "Required query parameter 'foo' is missing"
  '404':
    $ref: '#/components/responses/NotFound'
  '500':
    $ref: '#/components/responses/UnexpectedError'
```

[UKHSA Guidelines Error Handling](../../api-guidelines/error-handling.md#required-error-responses)
