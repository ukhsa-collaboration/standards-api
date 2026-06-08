# **SHOULD** use standard http status codes

`response` **SHOULD** use standard HTTP status codes.

## Invalid Example

`Error-500` is not a valid HTTP status code.

```yaml
/weather:
  get:
    responses:
      'Error-500':
        description: Internal Server Error
```

## Valid Example

`500` is a valid HTTP status code.

```yaml
/weather:
  get:
    responses:
      '500':
        description: Internal Server Error
```

[Zalando Guideline 150][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#150
