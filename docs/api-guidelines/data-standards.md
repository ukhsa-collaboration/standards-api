---
order: 12
---
# Data Standards

Data standards provide a common language for representing information, enabling different systems to understand and process data without ambiguity.

Consideration **MUST** be given to the use of appropriate data standards to ensure consistency and ease of integration.

## Core Principles

- APIs **MUST** use consistent data formats and standards across all endpoints.
- APIs **MUST** validate all incoming data against defined schemas.
- APIs **MUST** follow data protection and privacy requirements for sensitive data.
- APIs **MUST** document any deviations from standard formats.

## Data Models vs. Data Representations

It is important to differentiate between *data models* and *data representations*:

- **Data Model** defines the structure, relationships, and constraints of data within a specific domain. It is a conceptual blueprint that outlines how data elements relate to each other and the rules governing their use.

- **Data Representation** is the concrete format in which data is serialised for exchange or storage. For RESTful APIs, this is commonly [JSON][json].

## Industry Standards

APIs **SHOULD** adopt a domain-specific [UKHSA data model](https://confluence.collab.test-and-trace.nhs.uk/display/TCFPP/Logical+Data+Model) or adopt an existing industry standard where appropriate while still using [JSON][json] as its core/principal data representation.

When defining new APIs or uplifting APIs it is important to look for industry standards and open standards that have already been adopted within UKHSA or by other related organisations and industries, such as [FHIR][fhir] for health data which is used by NHS England and [OMOP][omop] for data analysis.

### FHIR Implementations

If implementing the FHIR standard:

- APIs **MUST** use [FHIR UK Core][fhir-uk-core] profiles where they exist.
- APIs **MUST** document any extensions to standard FHIR resources.
- APIs  **SHOULD** implement FHIR REST API patterns as described in the [FHIR specification][fhir-restful].
- APIs **MAY** create custom FHIR profiles when UK Core profiles don't meet your needs.

### OMOP Implementations

If implementing the OMOP Common Data Model:

- APIs **MUST** use standardised clinical tables as defined in the [OMOP CDM specification][omop].
- APIs **MUST** map source terminologies/vocabularies to OMOP standard concepts.
- APIs **SHOULD** implement [OMOP data quality assessment procedures][omop-dqd].
- APIs **MAY** create ETL processes to synchronised between OMOP and other standards such as FHIR when both are needed.

## Terminology Standards

Terminology (or controlled vocabularies) play a crucial role in ensuring that data has a consistent and unambiguous meaning.

Using common terminologies is essential for data quality, consistency, and interoperability.

Terminology is *not* the same as FHIR. FHIR provides the *structure* and *format* for exchanging data, while terminology defines the *meaning* of the data elements within that structure.

APIs **MUST** adopt standardised terminologies (e.g., [SNOMED CT][snomed-ct-uk-ed], [ICD-10][icd-10-5e], [dm+d][dmd]) whenever applicable.

APIs **SHOULD** specify the required terminologies for each data element within their OpenAPI definition, taking into account regional differences.

### Terminology Implementations

- APIs **SHOULD** use [SNOMED CT][snomed-ct-uk-ed] for clinical terms.
- APIs **SHOULD** use [ICD-10][icd-10-5e] for medical diagnosis.
- APIs **SHOULD** use [dm+d][dmd] for medicines and devices in England.
- APIs **SHOULD** document any regional terminology variations for Scotland, Wales, and Northern Ireland.
- APIs **SHOULD** provide terminology mappings when exchanging data across regions

## Additional Considerations

### Compliance

If there are regulatory or industry compliance requirements that mandate the use of specific data standards, these **MUST** be adhered to.

### Interoperability

When APIs are designed to exchange data with external systems, especially within a specific industry or domain, a recognised data standard **SHOULD** be adopted. This ensures that both the API and the consuming systems can understand the data exchanged.

### Over-Engineering

Data standards **MUST NOT** be applied blindly to every API. If an API's scope is extremely narrow, if it is not intended for data exchange, and if there are no compelling reasons for standardisation, then a custom model and representation may be more appropriate.

### Performance Degradation

If adopting a data standard would introduce significant overhead in terms of processing or data size, and if interoperability is not a critical requirement, a standard **MUST NOT** be forced into the design.

### Fit for purpose

If the data standard doesn't have the necessary types or fields to correctly describe the data, it **MUST NOT** be forced into the design.

### Internal APIs (Limited Scope)

In cases where APIs are purely internal and their data is not intended for broader exchange, the use of data standards **MAY** be considered if it would improve the consistency between internal services.

## Government Data Standards

As per the [GDS Guidence][gds-guidence] you **SHOULD** design your APIs to follow appropriate government data standards in the [Data Standards Catalog][gds-dsc] and [External Standards Catalog][gds-esc].

### Other relevent standards

- **JSON** ([RFC8259][json]) is a lightweight, text-based,
   language-independent data interchange format.
- **GeoJSON** ([RFC7946][geo-json]) is a geospatial data interchange format based on JavaScript Object Notation (JSON).

See [Common Data Types](./common-data-types.md) for additional standards.

[fhir]:https://hl7.org/fhir/
[fhir-restful]:https://hl7.org/fhir/http.html
[fhir-uk-core]:https://digital.nhs.uk/services/fhir-uk-core
[omop]:https://ohdsi.github.io/CommonDataModel/
[omop-dqd]:https://ohdsi.github.io/DataQualityDashboard/
[snomed-ct-uk-ed]:https://digital.nhs.uk/services/terminology-and-classifications/snomed-ct
[icd-10-5e]:https://classbrowser.nhs.uk/#/book/ICD-10-5TH-Edition
[dmd]:https://www.nhsbsa.nhs.uk/pharmacies-gp-practices-and-appliance-contractors/dictionary-medicines-and-devices-dmd
[gds-guidence]:https://www.gov.uk/guidance/gds-api-technical-and-data-standards#follow-the-technology-code-of-practice-and-other-standards
[gds-dsc]:https://alphagov.github.io/data-standards-authority/standards/
[gds-esc]: https://alphagov.github.io/data-standards-authority/standards/external-standards
[json]:https://datatracker.ietf.org/doc/html/rfc8259
[geo-json]:https://datatracker.ietf.org/doc/html/rfc7946
