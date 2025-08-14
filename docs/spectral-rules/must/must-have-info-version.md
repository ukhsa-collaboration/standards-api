# **MUST** have info version

The `info` object **MUST** have a `version` property that follows [semantic rules][1] to distinguish API versions.

## Invalid Example

```yaml
info:
  title: ...
  description: ...
  version: 1
  <...>
```

## Valid Example

```yaml
info:
  title: ...
  description: ...
  version: 1.1.0
  ...
```

[Zalando Guideline 218][2] and [Zalando Guideline 116][3]

[1]: http://semver.org/spec/v2.0.0.html
[2]: https://opensource.zalando.com/restful-api-guidelines/#218
[3]: https://opensource.zalando.com/restful-api-guidelines/#116
