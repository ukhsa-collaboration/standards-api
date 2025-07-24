---
order: 4
---
# Naming Conventions

## URI Structure

APIs **MUST** follow the defined hierarchical structure:

```text
https://azgw.api.ukhsa.gov.uk/namespace/product/v1/users/12345?sort=startDate
\____/  \___________________/ \______________________________/ \____________/
  |            |                            |                        |
scheme     authority                       path                  parameters
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

> [!NOTE]
> **Environments**  
> Domain Names for various environments can be found in the [API Management Low Level Design.](https://confluence.collab.test-and-trace.nhs.uk/display/BRP/API+Management+Low+level+Design+-+MVP)

### Namespaces

Namespaces and product names **MUST** be based on the [Business Capability Model](https://confluence.collab.test-and-trace.nhs.uk/display/AT/Business+Capability+Model).

> [!NOTE]
> Where applications supports multiple business capabilities then namespaces and product names should be based on the `Leading` one in [LeanIX](https://phe.leanix.net/phelive).

For example:

``` text
https://azgw.api.ukhsa.gov.uk/prevent/vaccine-management/v1/..
```

## Resource Names

APIs **MUST** use **lowercase plural nouns** to represent collections (e.g., /orders, /customers, /products) not verbs.

> [!TIP] Use
>
> ``` text
> /product/v1/orders
> /product/v1/orders/{orderId}/cancel
> ```

> [!CAUTION] Avoid
>
> ``` text
> /product/v1/order
> /product/v1/cancelOrder
> ```

## Path Segments

APIs **MUST** use **kebab-case** for path segments.

> [!TIP] Use
>
> ``` text
> /product/v1/user-accounts
> ```

> [!CAUTION] Avoid
>
> ``` text
> /product/v1/userAccounts
> /product/v1/user_accounts
> ```

## Parameter Names

APIs **MUST** use lower camel case for query parameter names.

> [!TIP] Use
>
> ``` text
> /product/v1/users?maxResults=10&startIndex=20
> ```

> [!CAUTION] Not
>
> ``` text
> /product/v1/users?max_results=10&start_index=20
> ```

### Terminology

APIs **MUST** use consistent names for query parameters having the same function across different endpoints.

Example:

> [!CAUTION] Avoid
>
> ``` text
> /product/v1/orders?limit=10&offset=20
> /product/v1/users?maxResults=10&startIndex=20
> ```

## Property Names

APIs **MUST** use lower camel case for properties.

Example:

> [!TIP] Use
>
> ``` json
> {
>     "customerId": "12345",
>     "userId" : "54321"
> }
> ```

> [!CAUTION] Not
>
> ``` json
> {
>     "customer_id": "12345",
>     "user_id" : "54321"
> }
> ```

## Terminology

Use consistent terminology across the API and in documentation. For instance, if you use `customer` in one part of your API, don't switch to `client` in another API if they represent the same concept.

Example query string:

> [!CAUTION] Avoid
>
> ``` text
> /product/v1/orders?customerId=123
> /product/v1/users?clientId=123
> ```

Example request/response model:
> [!CAUTION] Avoid
>
> ``` json
> # order
> {
>     "orderId": "12345",
>     "customerId" : "54321"
>     ...
> }
> 
> # user
> {
>     "userId": "12345",
>     "clientId" : "54321"
>     ...
> }
> ```
