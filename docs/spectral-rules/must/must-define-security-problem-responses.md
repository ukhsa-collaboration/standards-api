# **MUST** define 401 and 403 for secured operations

Operations that define their **own non-empty `security` block**  
**MUST** define responses for:

- `401 Unauthorized`
- `403 Forbidden`

These responses **MUST** include at least one example.

This ensures consumers of secured APIs receive consistent, meaningful error responses.

## Invalid Example

```yaml
paths:
  /secure-data:
    get:
      security:
        - oAuth:
            - data:read
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
```

## Valid Example

```yaml
paths:
  /secure-data:
    get:
      security:
        - oAuth:
            - data:read
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
        '401':
          description: Unauthorized
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'
              examples:
                unauthorized:
                  $ref: '#/components/examples/unauthorized'
        '403':
          description: Forbidden
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'
              examples:
                forbidden:
                  $ref: '#/components/examples/forbidden'
```

[UKHSA Guidelines Error Handling](../../api-design-guidelines/error-handling.md#required-error-responses)
