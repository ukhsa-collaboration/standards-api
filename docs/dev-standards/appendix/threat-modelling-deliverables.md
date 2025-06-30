# Threat modelling deliverables

This appendix provides detailed guidance on the required outputs of threat modelling.

These deliverables help ensure that threat models are consistent, actionable and easy to maintain.

## System context

Teams **MUST** document:

- a high-level description of the system and its purpose
- the types of data processed, including [sensitivity classification][2]
- user roles and trust boundaries
- links to relevant architecture documentation

## Data flow diagram

Teams **MUST** include a simple diagram that shows:

- key components and data stores
- external entities and integrations
- trust boundaries between components
- [data classifications][2] (e.g. personal, OFFICIAL, SECRET)

Diagrams **MUST** be created using **[draw.io][1]** and embedded in **Confluence**.

They **SHOULD** be high-level and focus on data movement and trust relationships, not implementation detail.

## STRIDE threat analysis

For each component or data flow, teams **MUST** consider the following threat categories:

- **Spoofing** — impersonating users or systems
- **Tampering** — modifying data or code
- **Repudiation** — denying actions or transactions
- **Information disclosure** — exposing sensitive data
- **Denial of service** — disrupting availability
- **Elevation of privilege** — gaining unauthorised access

Each identified threat **MUST** be recorded with a description and mapped to the affected component.

## Risk assessment

Each threat **MUST** be assessed for:

- **Impact** — high, medium or low
- **Likelihood** — high, medium or low

High-impact or high-likelihood threats **MUST** be prioritised.

Teams **SHOULD** consider current [threat intelligence from NCSC][3].

## Security controls

Teams **MUST**:

- map existing controls to identified threats
- identify gaps and define new controls
- document any accepted risks with rationale

## Security user stories

For each high or medium risk, teams **MUST** create one or more security user stories. These **MUST**:

- be added to the team backlog
- include clear acceptance criteria
- link to the relevant threat

### Example user story

> As a GP accessing patient records  
> I need to see only the health data for patients under my care  
> So that I cannot accidentally access confidential information about other patients
>
> **Acceptance criteria**:
>
> 1. When I search for a patient, I only see results for patients registered to my practice
> 1. If I try to access a patient record directly (e.g. via URL), I get an access denied message if they're not my patient
> 1. The system logs any attempt to access patient records outside my authorised list
> 1. I can see a clear message explaining why access was denied

## Validation plan

Teams **MUST** describe how each control will be tested. This **SHOULD** include:

- automated tests
- exploratory testing
- validation of logging and alerting

## Documentation

Threat models **MUST** be:

- stored in version control alongside the system codebase
- updated within 30 days of any significant change
- peer-reviewed and approved by a **Security Architect**

Documentation **SHOULD** be lightweight and easy to maintain. Diagrams and bullet points are preferred over long-form text.

## Tools

Teams **MUST** use:

- **[draw.io][1]** — for creating data flow diagrams embedded in Confluence

Teams **SHOULD** use:

- [OWASP Threat Dragon][4] — for diagramming and threat tracking
- GitHub or other version control — to store and track threat models

## References

- [draw.io][1]
- [Government Security Classifications][2]
- [NCSC Threat Intelligence][3]
- [OWASP Threat Dragon][4]
- [OWASP Threat Modelling Process][5]

[1]: https://www.drawio.com
[2]: https://www.gov.uk/government/publications/government-security-classifications
[3]: https://www.ncsc.gov.uk/collection/building-a-security-operations-centre/threat-intelligence
[4]: https://owasp.org/www-project-threat-dragon
[5]: https://owasp.org/www-community/Threat_Modeling_Process
