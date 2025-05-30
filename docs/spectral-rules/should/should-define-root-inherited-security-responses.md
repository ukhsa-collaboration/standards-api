# SHOULD define 401 and 403 when inheriting global security

If the **root path (`/`) operation does not define its own `security`** block  
and the API defines a **non-empty `security` block globally**,  
then the operation **SHOULD** define:

- `401 Unauthorized`
- `403 Forbidden`

These responses **SHOULD** include at least one example.

This encourages clarity and completeness in security-related responses  
when the root path inherits global security settings.

## Invalid Example

```yaml
security:
  - oAuth:
      - public:read

paths:
  /:
    get:
      responses:
        '200':
          description: OK
```

## Valid Example

```yaml
security:
  - oAuth:
      - public:read

paths:
  /:
    get:
      responses:
        '200':
          description: OK
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
