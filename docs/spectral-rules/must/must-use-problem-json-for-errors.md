# **MUST** use problem json for errors

The content type for `4xx` and `5xx` status codes **MUST** be `application/problem+json`.

## Invalid Example

The content type for the `503` response in this example incorrectly uses the `application/json` content type.

```yaml
responses:
   '503':
     description: ...
     content:
       application/json:
         schema:
           $ref: ../models/Problem.yaml
```

## Valid Example

The content type for the `503` response in this example correctly uses the `application/problem+json` content type.

```yaml
responses:
   '503':
     description: ...
     content:
       application/problem+json:
         schema:
           $ref: ../models/Problem.yaml
```

[Zalando Guideline 176][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#176
