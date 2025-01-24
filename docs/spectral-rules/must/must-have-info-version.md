# **MUST** have info version

The `info` object **MUST** have a `version` property that follows [semantic rules](http://semver.org/spec/v2.0.0.html) to distinguish API versions.

## Invalid Example

``` yaml
info:
  title: ...
  description: ...
  version: 1
  <...>
```

## Valid Example

``` yaml
info:
  title: ...
  description: ...
  version: 1.1.0
  ...
```

[Zalando Guideline 218](https://opensource.zalando.com/restful-api-guidelines/#218) and [Zalando Guideline 116](https://opensource.zalando.com/restful-api-guidelines/#116)
