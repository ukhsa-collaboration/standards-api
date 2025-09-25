# **MUST** have info value chain

The `info` object **MUST** have an `x-value-chain` that matches at least one of these values.

> [!IMPORTANT]
> For openapi definitions marked with `info.x-api-type: pygeoapi`, this rule’s severity is automatically set to `warn` by the `override-severity-pygeoapi` rule. See [1].

- `prevent`
- `detect`
- `analyse`
- `respond`
- `cross-cutting`
- `enabling`

## Valid Example

```yaml
info:
  title: Test Results Api
  x-value-chain: detect
```

[1]: ../index.md#pygeoapi-severity-overrides
