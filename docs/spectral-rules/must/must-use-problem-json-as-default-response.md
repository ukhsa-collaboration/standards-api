# **MUST** use problem json as default response

The content type for the default response **MUST** be `application/problem+json`.

> [!IMPORTANT]
> For openapi definitions marked with `info.x-api-type: pygeoapi`, this rule’s severity is automatically set to `warn` by the `override-severity-pygeoapi` rule. See [1].

## Invalid Example

The default response in this example incorrectly uses `application/json` as the content type.

```yaml
responses:
   ...
get:
  summary: Get User Info by User ID
   tags: []
   responses:
     ...
     default:
       description: ...
       content:
         application/json:
           schema:
             $ref: ../models/Problem.yaml
```

## Valid Example

The default response in this example correctly uses `application/problem+json` as the content type.

```yaml
responses:
   ...
get:
  summary: Get User Info by User ID
   tags: []
   responses:
     ...
     default:
       description: ...
       content:
         application/problem+json:
           schema:
             $ref: ../models/Problem.yaml
```

[Zalando Guideline 151][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: https://opensource.zalando.com/restful-api-guidelines/#151
