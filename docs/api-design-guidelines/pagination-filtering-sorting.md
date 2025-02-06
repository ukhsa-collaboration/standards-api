# Pagination, Filtering & Sorting

## Pagination

### Cursor-based pagination

**SHOULD** use cursor-based pagination for larger result sets.

**SHOULD** use cursor-based pagination for larger result sets or when the underlying dataset changes frequently.

Cursor-based pagination uses a “cursor” that points to a specific item in the dataset, typically a unique identifier, to determine where to start the next page of results. The cursor is passed as a query parameter, often encoded, and allows precise navigation through the dataset.

#### Query Parameters

`cursor`: The pointer to the position in the dataset to start the next page.
limit: The maximum number of items to return.

Example:

``` text
GET /product/v1/orders?cursor=eyJvcmRlcklkIjoxMjN9&limit=10
```

**SHOULD** provide sensible default values for the limit parameter when not provided.

**SHOULD** enforce a maximum limit to prevent clients from requesting excessively large pages that could degrade server performance.

### Pagination metadata

**SHOULD** return pagination metadata for larger result sets

The body of responses containing lists of results **SHOULD** contain pagination metadata for larger results sets:

- `Total results`: Include metadata in the response to inform the client of the total number of available items. This is useful for calculating the total number of pages or determining how much data remains.
- `Page`, `offset` or `cursor info`: Return information about the current page, offset, or cursor position, and how to retrieve the next set of results.

``` json
{
  "results": [
    {"id": 101, "item": "Item 1"},
    {"id": 102, "item": "Item 2"}
    // ... more results ...
  ],
  "metadata": {
    "total_results": 100,
    "total_pages": 10,
    "current_page": 1,
    "page_size": 10
  }
}
```

## Filtering

**SHOULD** use the `GET` `HTTP` method and ensure the filter is safe, idempotent and cacheable.

**SHOULD** use query parameters.

### Example

``` yaml
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
          schema:
            type: string
            description: The type of test to filter by.
            examples:
            - Lateral Flow Test
        - in: query
          name: result
          required: false
          schema:
            type: string
            description: The type of test to filter by.
            x-extensible-enum:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
            examples:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
```

``` text
GET /product/v1/results?type=Lateral%20Flow%20Test&result=POSITIVE
```

### Alternative Example

If there is a particularly common query parameter you **SHOULD** consider providing a new operation where the search parameter is embedded in the path as a path variable.

``` yaml
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
            examples:
              - '4857773456'
              - '485 777 3456'
              - '485-777-3456'
        - in: query
          name: type
          required: false
          schema:
            type: string
            description: The type of test to filter by.
            examples:
            - Lateral Flow Test
        - in: query
          name: result
          required: false
          schema:
            type: string
            description: The result type of test to filter by.
            x-extensible-enum:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
            examples:
              - POSITIVE
              - NEGATIVE
              - UNREADABLE
```

``` text
GET /product/v1/patients/4857773456/results?type=Lateral%20Flow%20Test
```

## Sorting

Default sort order **SHOULD** be considered as undefined and non-deterministic.

If a explicit sort order is desired, the query parameter `sort` **SHOULD** be used with the following general syntax: `{field_name}|{asc|desc},{field_name}|{asc|desc}`.

or `{+|-}{field_name},{+|-}{field_name}`

### Example

``` text
GET /product/v1/results?sort=nhs_number|asc,type|desc
```

### Alternative Example

``` text
GET /product/v1/results?sort=+nhs_number,-type
```
