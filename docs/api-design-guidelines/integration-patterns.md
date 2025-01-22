# Integration Patterns

**SHOULD** use standard API integration patterns.

TODO

- Asynchronous API
- Bulk

## Anti-corruption layer

**SHOULD** wrap legacy APIs in an anti-corruption layer (ACL) so that consumers are able to use modern REST-based API semantics.

Example:

Translate SOAP calls to REST calls.

- The ACL makes SOAP requests to the legacy API and exposes a RESTful endpoint for the new system.
- The ACL takes the XML data from the SOAP response and transforms it into a JSON format that the modern system expects.
- The ACL can map legacy API operations to RESTful principles (resources and HTTP methods).

## Asynchronous request-reply

**SHOULD** use the asynchronous request-reply API pattern for long running tasks, such as processing large datasets, image or video processing, or complex calculations.

- **Callback Pattern**: Use when the client provides an API to receive notifications.
- **Polling Pattern**: Use when the client does not provide an API to receive notifications.

Example:

``` text
POST /namespace/product/v1/tasks/123/start
Response: 202 Accepted
{
  "task_id": "123",
  "status": "in_progress"
}
```

Poll for status:

``` text
GET /namespace/product/v1/tasks/123/status
Response: 200 OK
{
  "status": "completed",
  "result": "success"
}
```
