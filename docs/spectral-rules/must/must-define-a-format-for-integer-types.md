# **MUST** define a format for integer types

`integer` properties **MUST** have a format defined (`int32`, `int64`, or `bigint`).

## Invalid Example

```yaml
requestBody:
    content:
      application/json:
        schema:
          type: object
          properties:
            range:
              type: integer
```

## Valid Example

```yaml
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          range:
            type: integer
            format: int32
```

[Zalando Guideline 171][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#171
