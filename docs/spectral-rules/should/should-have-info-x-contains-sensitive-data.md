# **SHOULD** have info.x-contains-sensitive-data

The OpenAPI `info` object **SHOULD** include a field `x-contains-sensitive-data` of type `boolean` to explicitly signal whether the API handles sensitive data such as Personally Identifiable Information (PII), Protected Health Information (PHI), financial data, or other regulated content.

Adding this flag allows downstream systems and reviewers to apply additional controls, validations, or security measures early in the API lifecycle.

See [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) and relevant regulatory frameworks (e.g., [GDPR](https://gdpr.eu/), [NHS – Protecting patient data](https://digital.nhs.uk/services/national-data-opt-out/understanding-the-national-data-opt-out/protecting-patient-data)) for background on handling sensitive data in APIs.

## Valid Example

```yaml
info:
  title: Clinical Records API
  version: 1.2.0
  x-contains-sensitive-data: true
```

## Guidance

Use `true` if any operations in the API may expose or accept sensitive data. Otherwise, set it explicitly to `false`.
