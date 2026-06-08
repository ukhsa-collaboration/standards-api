# **MUST** define a format for integer types

`integer` properties **MUST** have a format defined (`int32`, `int64`, or `bigint`).

> [!IMPORTANT]
> For OpenAPI definitions marked with `info.x-api-type: pygeoapi`, the pygeoapi ruleset downgrades this rule to `warn`. See [1].

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

[Zalando Guideline 171][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: https://opensource.zalando.com/restful-api-guidelines/#171
