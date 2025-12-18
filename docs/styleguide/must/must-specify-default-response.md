# **MUST** specify default response

Each `operation` **MUST** include a default error response that combines multiple errors.

> [!IMPORTANT]
> For openapi definitions marked with `info.x-api-type: pygeoapi`, this rule’s severity is automatically set to `warn` by the `override-severity-pygeoapi` rule. See [1].

## Invalid Example

The example below contains only a `200` response.

```yaml
responses:
   ...
get:
  summary: Get User Info by User ID
   tags: []
   responses:
     '200':
       description: OK
```

## Valid Example

The example below contains a `200` response and a `default` response that references the `Problem` errors file.

```yaml
responses:
   ...
get:
  summary: Get User Info by User ID
   tags: []
   responses:
     '200':
       description: OK
     default:
       description: User Not Found
       content:
         application/problem+json:
           schema:
             $ref: ../models/Problem.yaml
```

[Zalando Guideline 151][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: https://opensource.zalando.com/restful-api-guidelines/#151
