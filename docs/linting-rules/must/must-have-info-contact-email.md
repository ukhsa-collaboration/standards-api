# **MUST** have info contact email

The `info` object **MUST** have a `contact email` property that contains a valid email address for the responsible team.

> [!IMPORTANT]
> For OpenAPI definitions marked with `info.x-api-type: pygeoapi`, the pygeoapi ruleset downgrades this rule to `warn`. See [1].

## Valid Example

```yaml
info:
  ...
  ...
  contact:
    email: 'support.contact@acme.com'
```

[Zalando Guideline 218][2]

[1]: ../index.md#pygeoapi-severity-overrides
[2]: https://opensource.zalando.com/restful-api-guidelines/#218
