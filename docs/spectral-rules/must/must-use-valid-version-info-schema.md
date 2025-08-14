# **MUST** use valid version info schema

`ApiInfo` schema **MUST** include this set of minimal required properties and validations:

## Valid Example

```yaml
components:
  schema:
    ...
    ApiInfo:
      type: object
      description: Schema for detailing API information.
      properties:
        name:
          type: string
          description: The name of the API.
          example: Test Results API
        version:
          type: string
          pattern: '^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$'
          description: The version of the API.
          example: 1.0.0
        releaseDate:
          type: string
          format: date
          description: The release date of this API version.
          example: 2025-02-26
        documentation:
          type: string
          format: uri
          description: A URL to the API documentation.
          example: https://developer.ukhsa.gov.uk/namespace/product/v1/docs
        releaseNotes:
          type: string
          format: uri
          description: A URL to the API release notes.
          example: https://developer.ukhsa.gov.uk/namespace/product/v1/releaseNotes
      required:
        - name
        - version
        - releaseDate
        - documentation
        - releaseNotes
```
