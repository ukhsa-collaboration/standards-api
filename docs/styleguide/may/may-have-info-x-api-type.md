# **MAY** have info.x-api-type

APIs **MAY** include an `info.x-api-type` field to indicate the API category. When present, the value **MUST** be either `standard` or `pygeoapi`. If the field is omitted, the ruleset assumes the API is `standard`.

> [!IMPORTANT]
> Using `info.x-api-type: pygeoapi` signals pygeoapi-based definitions and enables conditional severity downgrades for certain rules. See [1].

## Valid Examples

```yaml
info:
  title: Test Results API
  version: 1.0.0
  x-api-type: standard
```

```yaml
info:
  title: Geospatial API
  version: 1.0.0
  x-api-type: pygeoapi
```

## Invalid Example

```yaml
info:
  title: Something
  version: 1.0.0
  x-api-type: experimental-non-pygeoapi
```

[1]: ../index.md#pygeoapi-severity-overrides
