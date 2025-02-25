# Data Standards

APIs **SHOULD** follow the GDS Standards

## Data Format and Types

- You **SHOULD** define explicit data types for all properties in your OpenAPI schemas.
- You **MUST** ensure that data formats (e.g., date-time, uuid) are used consistently across endpoints.
- You **MAY** introduce custom formats, but they **SHOULD** be documented clearly.

## Data Validation

- You **MUST** validate all incoming request data to maintain consistency and integrity.
- You **SHOULD** apply validation rules at both the service and model levels.
- You **MAY** return validation errors following the problem details guidelines.

## Data Integrity and Consistency

- You **MUST** ensure that data is stored in a reliable manner, preventing partial or corrupted data states.
- You **SHOULD** handle concurrency and conflict scenarios gracefully, especially with multiple updates.
- You **SHOULD NOT** alter data without proper versioning or retention strategies if historical accuracy is required.

## Data Classification and Privacy

- You **MUST** classify sensitive data (PII, PHI, etc.) according to organizational security policies.
- You **SHOULD** mask or encrypt data in transit and at rest, following applicable security guidelines.
- You **MAY** log non-sensitive data for troubleshooting, but **SHOULD NOT** log secrets or personal identifiers.

## Existing Standards

- You **MAY** leverage established data standards and formats, such as [FHIR UK Core](https://digital.nhs.uk/services/fhir-uk-core) and [OMOP](https://www.ohdsi.org/omop/) where appropriate.
- You **SHOULD** document any adaptations to these standards clearly, ensuring consumers understand how they deviate from the official specifications if necessary.

This document outlines best practices for adopting recommended API patterns and data standards within the UKHSA. Adhering to these standards will ensure interoperability, data consistency, and efficient information sharing.

## API Patterns

While the specific API patterns adopted by UKHSA should be clearly defined (e.g., RESTful APIs using JSON), it's crucial to address common errors and their handling. Consistency in error reporting is vital for developers.
The [NHS Spine Core API Framework](https://digital.nhs.uk/services/gp-connect/develop-gp-connect-services/development/error-handling#top) provides a useful model for standardising error handling. While UKHSA's context may differ, a similar approach can be adopted. This involves defining a consistent set of HTTP status codes and associated error messages for various scenarios. Consider mapping specific error conditions to appropriate HTTP status codes (e.g., 400 Bad Request for invalid input, 404 Not Found for missing resources, 500 Internal Server Error for unexpected server issues). Providing detailed error messages in a structured format (e.g., JSON) will aid debugging.

## Data Standards and Record Keeping

The [Professional Record Standards Body (PRSB)](https://theprsb.org/), commissioned by NHS England, plays a vital role in defining data standards for healthcare. Their work, including the [Core Information Standard (CIS)](https://theprsb.org/standards/core-information-standard/), provides a foundation for consistent data recording. CIS defines a set of information elements organised under headings like "Person demographics," covering data points such as `name`, `date of birth`, and `address history`.

Subsets of CIS, like the [Community Pharmacy Standard](https://theprsb.org/standards/communitypharmacy/), tailor the standard to specific healthcare settings. These subsets often share core components with CIS but include additional elements relevant to their specific domain. They may also provide implementation guidance, such as specifying information to be shared with GPs.

While the PRSB standards are valuable, it's important to acknowledge their limitations. Gaps exist, and some terminology may be outdated or contain an excessive number of concepts (e.g., codes for anatomical sites). Other standards, like [OpenEHR](https://specifications.openehr.org/), also exist and should be considered.

UKHSA **SHOULD** evaluate these options and choose the most appropriate standard(s) for their needs.

## Data Model vs. Representation

A crucial distinction exists between a _data model_ (what is stored) and its _representation_ (how it is transmitted). While a data model might mandate storing a citizen's full address history, the Information Commissioner's Office (ICO) Data Protection Principle (c) dictates that only necessary data should be processed for a specific purpose. Sharing a full address history when only a test result is required would be excessive.

Therefore, UKHSA **MUST** carefully consider what data is _stored_ versus what is _sent_. This will vary depending on the use case. Standardising this "what to send" aspect is crucial for efficient and privacy-preserving data exchange.

## FHIR (Fast Healthcare Interoperability Resources)

FHIR, developed by HL7, offers a solution for standardising healthcare data representation and exchange. It addresses:

1. A standard way to represent healthcare concepts in JSON or XML.
2. A standard way to transact this information between systems using FHIR APIs.

FHIR uses "resources" to represent healthcare concepts (e.g., "Medication," "Observation," "Condition," "Patient"). Resources contain elements, which can be primitive data types or complex types defined by the standard. For example, a "Patient" resource includes a `name` element of type `HumanName`, which has specific sub-elements for given names and surname.

_Cardinality_ specifies the number of occurrences of an element. For example, a patient might have multiple given names (cardinality of `0..*` or `1..*`), but typically one surname (`0..1` or `1..1`).

NHS England has developed "[UK Core](https://digital.nhs.uk/services/fhir-uk-core)" FHIR [profiles](https://www.hl7.org/fhir/profiling.html), which are tailored for UK use and align with international profiles (e.g., [US Core](https://www.hl7.org/fhir/us/core/)) where possible. Using profiles ensures consistency and interoperability within the UK.

## Terminology

Terminology (or controlled vocabularies) plays a crucial role in ensuring that data has a consistent and unambiguous meaning. It provides a standardised set of codes and descriptions for concepts, allowing different systems to understand and interpret data correctly. Imagine you're recording information about a person's health. Someone might describe their ailment as a "headache," while another person might describe it as a "migraine." While both relate to head pain, they are distinct conditions. A simple text field might capture both, but it wouldn't allow systems to easily differentiate between them.

Terminology provides specific codes for "headache" and "migraine" (e.g., specific codes within [SNOMED CT](https://digital.nhs.uk/services/terminology-and-classifications/snomed-ct)). Using these standardised codes ensures that all systems understand the precise nature of the reported condition. This is vital for accurate data analysis, reporting, and clinical decision support.

Terminology is _not_ the same as FHIR. FHIR provides the _structure_ and _format_ for exchanging data (like the container), while terminology defines the _meaning_ of the data elements within that structure (like the contents). FHIR resources often reference terminologies to ensure semantic interoperability. For example, a FHIR Observation resource for headache might use SNOMED CT codes to represent the specific type of headache.

Using standardised terminologies (e.g., [SNOMED CT](https://digital.nhs.uk/services/terminology-and-classifications/snomed-ct), [ICD-10](https://classbrowser.nhs.uk/#/book/ICD-10-5TH-Edition)) is essential for data quality, consistency, and interoperability. Within England, the NHS Dictionary of Medicines and Devices (dm+d) is commonly used for medicines and devices. However, it's important to note that other parts of the UK (Scotland, Wales, and Northern Ireland) may use different drug dictionaries and coding systems. Therefore, when exchanging data across the UK, it's crucial to consider these regional variations and ensure appropriate mapping or translation between terminologies.

UKHSA **SHOULD** specify the required terminologies for each data element within their data standards, taking into account these regional differences.

## Additional Considerations

Here are a few more points you might consider adding to the guidance:

- **Versioning:** API patterns, data standards, and terminologies evolve over time. The guidance should address versioning strategies. How will changes be managed? How will backwards compatibility be maintained (or not)? How will consumers of the APIs be notified of changes?
- **Security:** Security is paramount, especially when dealing with sensitive health data. The guidance should include security best practices, such as authentication, authorisation, data encryption (both in transit and at rest), and regular security audits. Reference relevant security standards (e.g., ISO 27001, NIST cybersecurity framework).
- **Data Governance:** Clear data governance policies are essential. Who is responsible for the data? How is data quality ensured? How is data access controlled? How is data retention and disposal managed?
- **Testing:** Robust testing is crucial for ensuring the quality and interoperability of systems. The guidance should encourage thorough testing, including unit tests, integration tests, and performance tests. Consider specifying testing frameworks or tools.
- **Documentation:** Comprehensive documentation is vital for developers and users. APIs and data standards should be well-documented, including clear explanations of their usage, data elements, error codes, and versioning information. Consider using documentation generators (e.g., Swagger/OpenAPI).
- **Implementation Guidance:** Provide practical implementation guidance, including examples and best practices. This will help developers adopt the standards more easily.
- **Conformance Testing:** Consider implementing conformance testing to verify that systems comply with the defined standards. This will help ensure interoperability.
- **Evolution and Maintenance:** The guidance should address how the standards will be maintained and updated over time. Who is responsible for this? What is the process for proposing changes? How will changes be communicated to stakeholders? (edited)
