# **MUST** have info api audience

The `info` object **MUST** have an `x-audience` that matches at least one of these values:

| audience | Use case |
| - | - |
| `company-internal` | for internal use only with UKHSA |
| `partner-external` | for UKHSA partners under a service agreement |
| `premium-external` | for publicly available but commercial/monetised APIs behind a paywall |
| `public-external` | for public and freely accessible APIs (e.g. Data Dashboard) |

## Valid Example

```yaml
info:
  title: Test Results Api
  x-audience: public-external
```
