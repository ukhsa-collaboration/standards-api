# **MUST** use normalized paths without empty path segments

Path segments **MUST** not contain duplicate slashes.

## Invalid Example

``` yaml
paths:
  /user//report:
```

## Valid Example

``` yaml
paths:
  /user-report:
```

[Zalando Guideline 136](https://opensource.zalando.com/restful-api-guidelines/#136)
