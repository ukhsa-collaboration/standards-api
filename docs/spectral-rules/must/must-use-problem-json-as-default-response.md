# **MUST** use problem json as default response

The content type for the default response **MUST** be `application/problem+json`.

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

[Zalando Guideline 151][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#151
