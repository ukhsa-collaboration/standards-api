# **SHOULD** prefer standard media type names

Response content **SHOULD** use a standard media type `application/json` or `application/problem+json` (required for problem schemas).

## Invalid Example

```yaml
'204':
  description: No Content
  content:
    application/xml:
      schema:
        type: object
        properties:
          name:
            type: string
          url:
            type: string
            format: uri-reference
```

## Valid Example

```yaml
'204':
  description: No Conten
  content:
    application/json:
      schema:
        type: object
        properties:
          name:
            type: string
          url:
            type: string
            format: uri-reference
```

[Zalando Guideline 172][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#172
