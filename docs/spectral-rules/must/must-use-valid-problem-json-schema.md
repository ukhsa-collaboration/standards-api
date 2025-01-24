# **MUST** use valid problem json schema

`Problem` schema **MUST** include this set of minimal required properties and validations:

``` yaml
type: object
properties:
  type:
    type: string
    format: uri-reference
  title:
    type: string
  status:
    type: integer
    format: int32
  detail:
    type: string
  instance:
    type: string
```

## Valid Example

``` yaml
title: Problem
type: object
properties:
  type:
    type: string
    format: uri-reference
    example: /my-example/user-error
  title:
    type: string
    example: a title for the error situation
  status:
    type: integer
    format: int32
  detail:
    type: string
    example: description for the error situation
  instance:
    type: string
    format: uri-reference
    example:  /some/uri-reference#specific-occurrence-context
```

[Zalando Guideline 176](https://opensource.zalando.com/restful-api-guidelines/#176)
