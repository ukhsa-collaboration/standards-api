# **MUST NOT** define request body for `GET` requests

A `GET` request **MUST NOT** accept a request body.

Defining a request body on a `HTTP` `GET` is frowned upon due to the confusion that comes from unspecified behaviour in the HTTP specification.

## Invalid Example

```yaml
paths:
  /results/{resultId}:
    get:
      summary: Get a specific test result
      description: Get a specific test result.
      operationId: getResult
      tags:
        - results
      requestBody:
        content:
          application/json:
            ...
```
