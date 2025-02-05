# **MUST** provide value chain

The `info` object **MUST** have an `x-value-chain` that matches at least one of these values.

- `prevent`
- `detect`
- `analyse`
- `respond`
- `cross-cutting`
- `enabling`

## Valid Example

``` yaml
info:
  title: Payments API
  x-value-chain: detect
```
