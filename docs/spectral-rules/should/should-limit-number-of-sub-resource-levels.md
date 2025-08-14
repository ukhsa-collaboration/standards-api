# **SHOULD** limit number of sub resource levels

Path **SHOULD** contain no more than 3 sub-resources (nested resources with non-root URL paths).

## Invalid Example

```yaml
/users/location/name/address/email:
```

## Valid Example

```yaml
/users/{userId}/{name}:
```

[Zalando Guideline 147][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#147
