# MUST always return json objects as top level data structures

The top-level data structure for a `request body` or `response body` must be an object.

## Invalid Example

```yaml lineNumbers

requestBody:
    content:
    application/json:
        schema:
        type: array
        items:
            type: string
```

## Valid Example

```yaml lineNumbers

requestBody:
    content:
    application/json:
        schema:
        type: object
        properties:
            first_name:
            type: string
            last_name:
            type: string
```

[Zalando Guideline 210](https://opensource.zalando.com/restful-api-guidelines/#210)
