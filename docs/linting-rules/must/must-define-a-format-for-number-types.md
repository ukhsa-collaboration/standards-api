# **MUST** define a format for number types

`number` properties **MUST** have a format defined (`float`, `double`, or `decimal`).

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
              type: number
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
            type: number
            format: float
```

[Zalando Guideline 171][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: https://opensource.zalando.com/restful-api-guidelines/#171
