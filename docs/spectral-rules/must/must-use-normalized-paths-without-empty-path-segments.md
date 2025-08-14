---
title: use normalised paths without empty path segments
---

# **MUST** use normalised paths without empty path segments

Path segments **MUST** not contain duplicate slashes.

## Invalid Example

```yaml
paths:
  /user//report:
```

## Valid Example

```yaml
paths:
  /user-report:
```

[Zalando Guideline 136][1]

[1]: https://opensource.zalando.com/restful-api-guidelines/#136
