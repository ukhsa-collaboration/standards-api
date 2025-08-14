# **SHOULD** always return json objects as top level data structures

The top-level data structure for a `request body` or `response body` **SHOULD** be an object.

## Invalid Example

```yaml
requestBody:
  content:
    application/json:
      schema:
      type: array
      items:
        type: string
```

## Valid Example

```yaml
requestBody:
  content:
    application/json:
      schema:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
```

[UKHSA Guidelines API Design][1]

[Zalando Guideline 210][2]

[1]: ../../api-guidelines/api-design.md#response-format
[2]: https://opensource.zalando.com/restful-api-guidelines/#210
