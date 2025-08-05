---
eleventyNavigation:
  parent: api-design-guidelines
---
# API Guidelines Summary

This is summary high-level guidance for API producers (application teams) on adopting the API principles, patterns and practices developed as part of the Big Rocks API strategy. Refer to the full API Strategy and other references linked at the end of this document for more information.

## Definitions

- **APIM Platform**: [API Management Platform](https://confluence.collab.test-and-trace.nhs.uk/display/BRP/API+Management+Solution+Design#APIManagementSolutionDesign-AzureAPI-M), a UKHSA-wide platform for managing and accessing APIs.
- **Developer Portal**: Component of the APIM Platform used by developers to access APIs, onboard new APIs, and view API documentation.
- **API Catalogue**: Feature of the Developer Portal that will contain all information related to APIs onboarded and available on the APIM Platform.

## Principles

These are the core high level principles to follow when designing, building, testing and deploying your APIs.

### Prioritise Reusability

> [!TIP]
> Apply the [API Design Guidelines](../api-guidelines/index.md) and use the features of Developer Portal.

- **Check the API does not already exist** by reviewing the UKHSA API Catalogue as well as the [cross-government UK API Catalogue](https://www.api.gov.uk/#uk-public-sector-apis). Evaluate if an existing API could potentially be enhanced to also support the new use case.
- **Design your API to be reused**. APIs should be broken down into reusable composable interactions and data groupings. APIs should aim to be use case agnostic if possible and the design and naming must be consistent with the established API Design Guidelines.

### Adopt API-first Practices

> [!TIP]
> Apply the [API Design Guidelines](../api-guidelines/index.md) and use the features of Developer Portal.

- **Design the API first**. Follow [GDS guidance](https://www.gov.uk/guidance/gds-api-technical-and-data-standards#design-your-api-first) and [UKHSA API Design Guidelines](../api-guidelines/index.md).
- Produce an OpenAPI definition utilising the [OpenAPI specification](https://swagger.io/specification/) as the first output of your design process, and then develop it iteratively along with the service.
- Share this specification early in development using the Developer Portal to get early feedback on your design.

> [!NOTE]
> API first is the practice of designing software starting with an API, before designing your web or mobile user interface. Developing the API before the rest of the service means a platform or service can be built around the API.

### Use Established API Patterns & Standards

> [!TIP]
> Adopt the recommended API patterns and [data standards](../api-guidelines/data-standards.md).

- **Adopt the recommended patterns & standards**, including industry and open standards where appropriate. Follow the [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice) and other standards recommended in UKHSA API guidelines, such as `HTTP REST`, `JSON` and related industry standards used by NHS such as `FHIR` and `OMOP`.  

### Prioritise API Security

> [!TIP]
> Adopt the [API security patterns](../api-guidelines/security.md).

- **Follow secure by design process** in the [Secure by Design Guidelines](https://www.security.gov.uk/policy-and-guidance/secure-by-design/) and industry best practices, including the [OWASP API Security Project](https://owasp.org/www-project-api-security/). Ensure your API has extensive tests that validate inputs.
- Ensure APIs have robust authorisation and authentication based on industry standards, such as OAuth 2.0 and OpenID Connect. The APIM Platform will act as a “transparent proxy” in authorisation scenarios, which includes passing through of auth tokens to backend APIs.
- Ensure that APIs are protected against overuse using rate limits by leveraging the features of the APIM Platform.

### Manage API Lifecycles

> [!TIP]
> Adopt the [API versioning & deprecation patterns](../api-guidelines/versioning-and-deprecation.md).

- **Use the recommended versioning scheme** to set clear expectations for clients on how change will be managed. Keep the number of active versions of an API to a minimum and have a process to retire old API versions. Refer to the Big Rocks guidance on API patterns for more information.

### Generate API Documentation

> [!TIP]
> Create an [OpenAPI definition](../api-guidelines/api-specifications-and-documentation.md) and use the features of Developer Portal to publish it.

- **Ensure the API is well documented** using an OpenAPI definition. Documentation should be concise and easy for developers use. The specification is machine-readable and will support the generation of consistent accessible documentation. It can also be used to accelerate development and testing through code generation.
- Use the Developer Portal to make the API discoverable and ensure it is always accurate, consistent, usable, and discoverable. This documentation supplements the solution documentation on Confluence and [LeanIX Basic Concepts and Modelling Guidance](https://confluence.collab.test-and-trace.nhs.uk/display/AT/LeanIX+Basic+Concepts+and+Modelling+Guidance).

### Support Testing with API Specifications

> [!TIP]
> Adopt the recommended [testing patterns](../api-guidelines/testing.md) and use the features of Developer Portal in the SIT environment to support testing.

- Use the OpenAPI definition to help **define testing requirements early in development** and to prepare the test scripts and data that will be needed. Use tools that automatically generate test stubs and client code from your OpenAPI definition to build functional tests.

### Test API Performance

> [!TIP]
> Adopt the recommended [performance, reliability and monitoring guidelines](../api-guidelines/performance-reliability-monitoring/index.md) and use the features of Developer Portal in the NFT environment.

- **Test performance meets non-functional requirements**. Response times and availability must conform to UKHSA standards and provide a high quality of service to clients.

### Follow Regulations & UKHSA Governance

> [!TIP]
> Check the onboarding requirements if you are API product or consumer and want to onboard your application or service.

- Follow the [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice) and other UK Government standards. Follow relevant regulations, including the [UK General Protection Regulation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/) (GDPR). Ensure your API has a business case and technical solution that complies with organisational standards and is aligned with UKHSA technology strategy.
- Follow the [Technology Governance Schedule and Audit Trail](https://confluence.collab.test-and-trace.nhs.uk/display/AT/Technology+Governance+Schedule+and+Audit+Trail) process before onboarding a new solution into the APIM Platform.
- Ensure [API Onboarding](https://confluence.collab.test-and-trace.nhs.uk/display/BRP/API+Onboarding) requirements are met.
