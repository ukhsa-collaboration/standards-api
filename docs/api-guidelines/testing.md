---
order: 9
---
# Testing

## Validation / Linting

**MUST** validate the OpenAPI definition against the OpenAPI Specification and the [UKSHA spectral ruleset](../spectral-rules/index.md).

## Unit Testing

**MUST** perform appropriate **Unit Testing** to verify the functionality of various components within the API implementation.

## Integration Testing

**SHOULD** perform **Contract Testing** to ensure that the API implementation adheres to the OpenAPI definition.

> This is especially important given the OpenAPI definition is the blueprint for onboarding APIs onto the APIM Platform.

**SHOULD** perform **End-to-End Testing** to ensure that all the components of the API work seamlessly together as a complete system.

| | Contract Testing | End-to-End Testing |
| - | --- | --- |
| **Purpose** | To ensure that services communicate correctly by validating API contracts. | To verify that all the components of the API work seamlessly together as a complete system. |
| **When to use** | When microservices or APIs are involved, especially in a distributed system. | When you need to test workflows which might involve multiple API calls, integrations, and the overall system functionality. |
| **How it's done** | By verifying the API implementation is communicating as defined in the APIs OpenAPI definition. | By simulating real user scenarios and executing tests through the application's UI or API. |
| **What it reveals** | Issues related to API compatibility and service interactions. | Overall application behaviour, including performance and user experiences. |

## Performance Testing

- **SHOULD** perform **Load Testing** to ensure the API can handle expected levels of load by simulating normal to high levels traffic to your API.
- **SHOULD** perform **Stress Testing** to understand the behaviour the API under extreme conditions and identify breaking points by simulating extreme levels of traffic to your API.

| | Load Testing | Stress testing |
| - | --- | --- |
| **Purpose** | Ensures system can handle normal traffic and data volume | Determines system's breaking point and recovery |
| **When to use** | Before release or major updates | Before high-stress events or periodically |
| **How it's done** | Simulate normal to high levels of traffic | Simulate extreme levels of traffic |
| **What it reveals** | System lag, slow performing endpoints, or crashes | How the system fails or scales under extreme conditions |

## Security Testing

**SHOULD** conduct **Vulnerability Scanning** To identify known vulnerabilities in your API.

**SHOULD** conduct **Penetration Testing** manual and or automated, to identify security weaknesses in your API.

| | Vulnerability Scanning | Penetration Testing |
| - | --- | --- |
| **Purpose**             | To identify known vulnerabilities in an API or software application. | To simulate an attack on the API to exploit vulnerabilities and assess security measures. |
| **When to use**         | During the development lifecycle or regularly to ensure ongoing security. | After significant changes to the API or before a major release to evaluate security posture. |
| **How it's done**       | By using automated tools to scan code, configuration, and network settings for vulnerabilities. | Reconnaissance, vulnerability scanning, attempting to exploit vulnerabilities, and finally providing a detailed report. Typically performed by a security specialist/professional. |
| **What it reveals**     | A list of known vulnerabilities, misconfigurations, and weaknesses in the API. | Specific vulnerabilities that can be exploited, their impact, and recommendations for remediation. |

## Recommended Testing Tools

| Tool | Useful For | Open Source Licence |
| -- | -- | -- |
| **[Spectral CLI](https://docs.stoplight.io/docs/spectral)** | Validating your OpenAPI definitions against the OpenAPI Specification and the [UKSHA spectral ruleset](../spectral-rules/index.md). | [Apache 2.0](https://opensource.org/license/apache-2-0) |
| **[Prism](https://stoplight.io/open-source/prism)** | API Mock Servers from OpenAPI definition<br>Contract Testing for API consumers and developers. | [Apache 2.0](https://opensource.org/license/apache-2-0) |
| **[Pact](https://docs.pact.io/)** | Consumer-Driven Contract Testing to ensure that your API meets the expectations of its consumers. | [MIT](https://opensource.org/license/mit) |
| **[Zed Attack Proxy (ZAP)](https://www.zaproxy.org/)** | Web application vulnerability scanner. | [Apache 2.0](https://opensource.org/license/apache-2-0) |

There is also a catalog of [OpenAPI Tooling](https://tools.openapis.org/) to support API development and validation.
