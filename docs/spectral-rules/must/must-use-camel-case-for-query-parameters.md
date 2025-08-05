# **MUST** use camel case for query parameters

Query parameters **MUST** use [camel-case](https://en.wikipedia.org/wiki/Camel_case) strings that match this pattern: `^[a-z][a-z0-9]+(?:[A-Z][a-z0-9]+)*$`.

| Name | Description |
|---------|-------------|
| camel case | The first letter of the first word **MUST** begin with a lowercase letter, the first letter of each subsequent word **MUST** begin with a capital letter and **MUST NOT** contain any separators between words such as spaces or special characters such as hyphens or underscores. |

## Invalid Examples

``` text
/product/v1/users?max_results=10&StartIndex=20&OTHER_PARAM=thing&other_other_param=that
```

## Valid Examples

``` text
/product/v1/users?maxResults=10&startIndex=20
```

[UKHSA Guidelines Parameter Names](../../api-guidelines/naming-conventions.md/#parameter-names)
