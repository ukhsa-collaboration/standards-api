# **should** have location header in 201 response

`201 Created` responses to `POST` methods **SHOULD** have a `Location` header identifying the location of the newly created resource.

See [RFC9110 Section 10.2.2](https://datatracker.ietf.org/doc/html/rfc9110#section-10.2.2) for more information on the `Location` header.

## Valid Example

``` yaml
paths:
  /results:
    get:
    ...
    post:
      summary: Submit a new test result
      description: Submit a new test result.
      operationId: submitResult
      tags:
        - Test Results
      requestBody:
      ...
      responses:
        '201':
          description: This response returns a JSON object containing the test result data.
          headers:
            Location:
            description: The URL of the created test result.
            schema:
              type: string
              format: uri
              example: https://azgw.api.ukhsa.gov.uk/detect/testing/v1/results/de750613-ef3c-4f5d-8148-10308b91896c
      ...
```

[UKHSA Guidlelines API Design](../../api-guidelines/api-design.md#rest-http-response-codes)
