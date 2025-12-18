# **SHOULD** use hyphenated pascal case for header parameters

Header parameters **SHOULD** use hyphenated Pascal case.

| Name | Description |
| - | - |
| hyphenated pascal | Each word **MUST** begin with a capital letter, and be separated by a hyphen. |

## Invalid Example

```yaml

parameters:
- schema:
    type: string
    in: header
    name: PascalCaseHeader
```

## Valid Example

```yaml

parameters:
- schema:
    type: string
    in: header
    name: Pascal-Case-Header
```

[Zalando Guideline 132][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#132
