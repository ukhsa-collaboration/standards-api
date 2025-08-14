# **MUST** define a format for number types

`number` properties **MUST** have a format defined (`float`, `double`, or `decimal`).

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

[Zalando Guideline 171][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#171
