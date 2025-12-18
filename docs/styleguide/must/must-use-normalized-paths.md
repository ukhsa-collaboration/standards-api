# **MUST** use normalised paths

Path **MUST** start with a slash and **MUST NOT** end with a slash (except root path `/`).

## Invalid Example

```yaml
paths:
  /patient/:
    ...
  /patient/{patientId}/results/:
```

## Valid Example

```yaml
paths:
  /:
    ...
  /patient:
    ...
  /patient/{patientId}/results:
```

[Zalando Guideline 136][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#136
