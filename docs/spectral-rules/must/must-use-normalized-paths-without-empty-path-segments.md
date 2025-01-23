# **MUST** use normalized paths without empty path segments

Path segments **MUST** not contain duplicate slashes.

## Invalid Example

``` yaml
/user//report:
```

## Valid Example

``` yaml
/beach-report:
```

[Zalando Guideline 136](https://opensource.zalando.com/restful-api-guidelines/#136)
