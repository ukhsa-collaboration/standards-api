# **MUST** specify default response

Each `operation` **MUST** include a default error response that combines multiple errors.

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

[Zalando Guideline 151][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#151
