---
order: 8
---

# Pagination, Filtering & Sorting

## Pagination

### Offset-based pagination

**SHOULD** use offset-based pagination for *smaller* result sets.

Offset-based pagination uses `limit` and `offset` query parameters to specify the number of items to return and the starting position in the dataset.

#### Query Parameters

- `limit`: The maximum number of items to return.
- `offset`: The number of items to skip before starting to collect the result set.

```text
GET /product/v1/orders?offset=10&limit=10
```

**SHOULD** provide sensible default values for the limit and offset parameters when not provided.

**SHOULD** enforce a maximum limit to prevent clients from requesting excessively large pages that could degrade server performance.

### Cursor-based pagination

**SHOULD** use cursor-based pagination for *larger* result sets or when the underlying dataset changes frequently.

Cursor-based pagination uses a “cursor” that points to a specific item in the dataset, typically a unique identifier, to determine where to start the next page of results. The cursor is passed as a query parameter, often encoded, and allows precise navigation through the dataset.

#### Query Parameters

- `cursor`: The pointer to the position in the dataset to start the next page.
- `limit`: The maximum number of items to return.

```text
GET /product/v1/orders?cursor=eyJvcmRlcklkIjoxMjN9&limit=10
```

**SHOULD** provide sensible default values for the limit parameter when not provided.

**SHOULD** enforce a maximum limit to prevent clients from requesting excessively large pages that could degrade server performance.

### Pagination metadata

**SHOULD** return pagination metadata for larger result sets

The body of responses containing lists of results **SHOULD** contain pagination metadata for larger results sets:

- `total`: Used to inform the client of the total number of available items. This is useful for calculating the total number of pages or determining how much data remains.
- `offset` or `cursor`: Information about the current result set, `offset`, or `cursor` position.
- `limit`: The maximum number of items returned.

```json
{
  "results": [
    {"id": 101, "item": "Item 1"},
    {"id": 102, "item": "Item 2"}
    // ... more results ...
  ],
  "metadata": {
    "total": 100,
    "offset": 10,
    "limit": 10
  }
}
```

## Filtering

**SHOULD** use the `GET` `HTTP` method and ensure the filter is safe, idempotent and cacheable.

**SHOULD** use query parameters.

### Example

```text
GET /product/v1/results?type=Lateral%20Flow%20Test&result=POSITIVE
```

```yaml
paths:
  /results:
    get:
      summary: List all test results
      description: List all test results.
      operationId: getResults
      tags:
        - results
      parameters:
        - in: query
          name: type
          required: false
          description: The type of test to filter by.
          schema:
            type: string
            pattern: '^(eq|ne|gt|lt|gte|lte|in|nin|like|ilike)?:?([^:&]+)$'
            description: "RHS filter expression in format '{operation}:{value}'."
            example: "eq:Lateral%20Flow%20Test"
          example: Lateral Flow Test
        - in: query
          name: result
          required: false
          description: The result type of test to filter by.
          schema:
            type: string
            x-extensible-enum:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
            example: POSITIVE
```

### Expressions

**SHOULD** use Right-Hand Side (`RHS`) operators to filter on specific fields in a resource.

`RHS` operators allow more sophisticated filtering than simple equality checks. Use these operators by appending them to the field name with a colon.

#### Operators

Available RHS operators include:

| Operator | Description |
| :-: | - |
| `eq` | Equal to (default if no operator specified). |
| `ne` | Not equal to. |
| `gt` | Greater than. |
| `gte` | Greater than or equal to. |
| `lt` | Less than. |
| `lte` | Less than or equal to. |
| `in` | Matches any value in a comma-separated list. |
| `nin` | Does not match any value in a comma-separated list. |
| `like` | Pattern matching with wildcards (`*`). |
| `ilike` | Case-insensitive pattern matching with wildcards (`*`). |

### Examples

```text
GET /product/v1/results?type=Lateral%20Flow%20Test&result=in:POSITIVE,NEGATIVE
```

```text
GET /product/v1/results?nhsNumber=like:485777*
```

```text
GET /products?category=electronics&price=gte:100
```

You can combine multiple filters using the same URL by separating them with ampersands (&).

```text
GET /products?category=electronics&price=gte:100&price=lte:500
```

### Alternative Example

If there is a particularly common query parameter you **SHOULD** consider providing a new operation where the search parameter is embedded in the path as a path variable, but only where it makes sense from an API design perspective and aligns with RESTful resource / nested resources.

```text
GET /product/v1/patients/4857773456/results?type=Lateral%20Flow%20Test
```

```yaml
paths:
  /patients/{nhsNumber}/results:
    get:
      summary: List all test results for given nhs number.
      description: List all test results for given nhs number.
      operationId: getResultsForNhs
      tags:
        - results
      parameters:
        - in: path
          name: nhsNumber
          required: true
          schema:
            type: string
            pattern: '^\d{3}(?:-| )?\d{3}(?:-| )?\d{4}$'
            description: The nhs number of patient
            example: '4857773456'
        - in: query
          name: type
          required: false
          description: The type of test to filter by.
          schema:
            type: string
            example: Lateral Flow Test
        - in: query
          name: result
          required: false
          description: The result type of test to filter by.
          schema:
            type: string
            x-extensible-enum:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
            example: POSITIVE
```

## Sorting

Default sort order **SHOULD** be considered as undefined and non-deterministic.

If a explicit sort order is desired, the query parameter `sort` **SHOULD** be used with the following general syntax: `{fieldName}|{asc|desc},{fieldName}|{asc|desc}`.

### Example

```text
GET /product/v1/results?sort=nhsNumber|asc,type|desc
```

```yaml
components:
  parameters:
    sortParam:
      in: query
      name: sort
      description: How to sort the results.
      schema:
        type: string
        pattern: ^[a-z]+(?:[A-Z][a-z]+)+\|(?:asc|desc)(?:,[a-z]+(?:[A-Z][a-z]+)*\|(?:asc|desc))*$
      examples:
        sortBySingleField:
          value: nhsNumber|asc
          summary: Sort by a single field
        sortByMultipleField:
          value: nhsNumber|asc,type|desc
          summary: Sort by multiple fields
```
