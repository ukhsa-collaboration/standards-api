# **SHOULD** declare enum values using upper snake case format

`enum` and `x-extensible-enum` values **SHOULD** be in UPPER\_SNAKE\_CASE format.

## Invalid Example

```yaml
schema:
  measurement:
   type: string
     x-extensible-enum:
       - Standard
       - Metric
       - Imperial
       - Non-standard
```

## Valid Example

```yaml
schema:
  measurement:
   type: string
     x-extensible-enum:
       - STANDARD
       - METRIC
       - IMPERIAL
       - NON_STANDARD
```

[Zalando Guideline 240][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#240
