# **MUST** use camel case for property names

Property names **MUST** use [camel-case](https://en.wikipedia.org/wiki/Camel_case) strings that match this pattern: `^[a-z][a-z0-9]+(?:[A-Z][a-z0-9]+)*$`.

| Name | Description |
|---------|-------------|
| camel case | The first letter of the first word **MUST** begin with a lowercase letter, the first letter of each subsequent word **MUST** begin with a capital letter and **MUST NOT** contain any separators between words such as spaces or special characters such as hyphens or underscores. |

## Invalid Examples

``` text
CustomerNumber
Customer_Number
customer-number
```

## Valid Examples

``` text
customerNumber
salesOrderNumber
billingAddress
```

[UKHSA Guidelines Property Names](../../api-guidelines/naming-conventions.md/#property-names)
