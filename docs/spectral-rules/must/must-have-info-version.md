# **MUST** have info version

The `info` object **MUST** have a `version` property that follows [semantic rules][1] to distinguish API versions.

> [!IMPORTANT]
> For OpenAPI definitions marked with `info.x-api-type: pygeoapi`, the pygeoapi ruleset downgrades this rule to `warn`. See [2].

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

[Zalando Guideline 218][3] and [Zalando Guideline 116][4]

[1]: http://semver.org/spec/v2.0.0.html
[2]: ../index.md#pygeoapi-severity-overrides
[3]: https://opensource.zalando.com/restful-api-guidelines/#218
[4]: https://opensource.zalando.com/restful-api-guidelines/#116
