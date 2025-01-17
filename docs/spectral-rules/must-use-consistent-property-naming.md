# **MUST** use consistent property naming

Property names **MUST** use [camel-case](https://en.wikipedia.org/wiki/Camel_case) strings that match this pattern: `^[a-z][a-z0-9]+(?:[A-Z][a-z0-9]+)*$`. or [snake_case](https://en.wikipedia.org/wiki/Snake_case) strings that match this pattern: `^[a-z_][a-z_0-9]*$`

| Name | Description |
|---------|-------------|
| camelCase| The first word **MUST** starts with a lowercase letter and each subsequent word **MUST** begin with a capital letter, without spaces or underscores.|
| snake_case | The first character **MUST** be a lower case letter, or an underscore, and subsequent characters can be a letter, an underscore, or a number. |

## Invalid Examples

`CustomerNumber`

`Customer_Number`

`customer-number`

## Valid Examples

`customerNumber` or `customer_number`

`salesOrderNumber` or `sales_order_number`

`billingAddress` or `billing_address`

[UKHSA Guideline Property Names](../naming-conventions.md/#property-names)