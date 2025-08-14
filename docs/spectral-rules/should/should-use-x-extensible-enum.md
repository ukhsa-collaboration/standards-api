# **SHOULD** use `x-extensible-enum`

`enum` values **SHOULD** use the marker `x-extensible-enum` rather than `enum`.

## Invalid Example

```yaml
deliveryMethods:
  type: string
  enum:
    - PARCEL
    - LETTER
    - EMAIL
```

## Valid Example

```yaml
deliveryMethods:
  type: string
  x-extensible-enum:
    - PARCEL
    - LETTER
    - EMAIL
```

[Zalando Guideline 112][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#112
