# **SHOULD** use `x-extensible-enum`

`enum` values **SHOULD** use the marker `x-extensible-enum` rather than `enum`.

## Invalid Example

``` yaml

delivery_methods:
type: string
enum:
    - PARCEL
    - LETTER
    - EMAIL
```

## Valid Example

``` yaml

delivery_methods:
type: string
x-extensible-enum:
    - PARCEL
    - LETTER
    - EMAIL
```

[Zalando Guideline 112](https://opensource.zalando.com/restful-api-guidelines/#112)
