# **MUST** use normalised paths without a trailing slash

Path segments **MUST NOT** contain duplicate slashes.

## Invalid Example

``` yaml
/user//report:
```

## Valid Example

``` yaml
/beach-report:
```

[Zalando Guideline 136](https://opensource.zalando.com/restful-api-guidelines/#136)
