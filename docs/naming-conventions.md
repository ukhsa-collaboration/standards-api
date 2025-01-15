# Naming Conventions

## URI Structure

APIs **MUST** follow the defined hierarchical structure:

```text
https://azgw.api.ukhsa.gov.uk/namespace/product/v1/users/12345?sort=startDate
\____/  \___________________/ \______________________________/ \________/
  |            |                            |                      |
scheme     authority                       path                parameters
```

- **Scheme**: **MUST** always be `https://`
- **Authority**: Will be determined by the APIM platform
- **Path**: Will consist of components:
  - **Namespace**: Predefined business area or capability
  - **Product**: The business product name
  - **Version (v1)**: the major API version with 'v' prefix
  - **Collection (users)**: the REST collection
  - **Resource (12345)**: The REST resource identifier

Each resource **MUST** be uniquely identifiable by a Uniform Resource Identifier (URI).

APIs **MUST** use lowercase for the entire URI.

APIs **SHOULD** limit the level of nesting to avoid overly complex URIs. Typically, two to three levels are sufficient.

> [!NOTE] Environments
> Domain Names for various environments can be found in the [API Management Low Level Design.](https://confluence.collab.test-and-trace.nhs.uk/display/BRP/API+Management+Low+level+Design+-+MVP)

### Namespaces

Namespaces and product names **MUST** be based on the [Business Capability Model](https://confluence.collab.test-and-trace.nhs.uk/display/AT/Business+Capability+Model).

For example:

```text
https://azgw.api.ukhsa.gov.uk/prevent/vaccine-management/v1/..
```

## Resource Names

APIs **MUST** use **lowercase plural nouns **to represent collections (e.g., /orders, /customers, /products) not verbs.

> [!TIP]Use
>
> ```text
> /product/v1/orders
> /product/v1/orders/{orderId}/cancel
> ```

> [!CAUTION]Avoid
>
> ```text
> /product/v1/order
> /product/v1/cancelOrder
> ```

## Path Segments

APIs **MUST** use **kebab-cas**e for path segments:

> [!TIP]Use
>
> ```text
> /product/v1/user-accounts
> ```

> [!CAUTION]Avoid
>
> ```text
> /product/v1/userAccounts
> /product/v1/user_accounts
> ```

## Parameter Names

APIs **MUST** use either **snake_case** or **camelCase** consistently and **MUST** not mix the two styles:

> [!TIP]Use
> **snake_case**:
> 
> ```text
> /product/v1/users?max_results=10&start_index=20
> ```
>
> **OR camelCase**:
>
> ```text
> /product/v1/users?maxResults=10&startIndex=20
> ```

> [!CAUTION]Avoid
> **mixed case**:
>
> ```text
> /product/v1/users?max_results=10&startIndex=20
> ```

APIs **MUST** use consistent names for query parameters having the same function across different endpoints.

Example:

```text
/product/v1/orders?limit=10&offset=20
/product/v1/users?max_results=10&start_index=20
```

Use consistent terminology across the API and in documentation. For instance, if you use "customer" in one part of your API, don’t switch to "client" in another API if they represent the same concept:

Example:

```text
/product/v1/orders?customer_id=123
/product/v1/users?client_id=123
```

## Field Names

APIs **MUST** use either **snake_case** or **camelCase** consistently and **MUST NOT** mix the two styles:

**snake_case**:

```json
{
    "customer_id": "12345",
    "user_id" : "54321"
}
```

OR camelCase:

```json
{
    "customerId": "12345",
    "userId" : "54321"
}
```
