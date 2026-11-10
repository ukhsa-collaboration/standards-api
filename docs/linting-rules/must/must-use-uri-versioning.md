# **MUST** use URI versioning

Path **MUST** start with a `MAJOR` version segment unless the version is already present in every `servers[].url`.

## Invalid Examples

```yaml
/user:
```

```yaml
/user/v1:
```

## Valid Example

```yaml
/v1/users:
```

<a href="../../api-guidelines/versioning-and-deprecation.md#uri-versioning">UKHSA Guidelines Versioning</a>
