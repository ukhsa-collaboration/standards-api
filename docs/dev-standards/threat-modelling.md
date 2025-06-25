# Threat Modelling Policy and Guidance

## Introduction

All UKHSA systems **MUST** be designed with security considerations from the outset. Threat modelling is a lightweight, systematic approach to identify and mitigate security risks during system design, protecting public health data and maintaining service availability.

**Policy objective**: Design secure systems through risk-based threat analysis that integrates naturally into agile development workflows.

## When to threat model

Teams **MUST** perform threat modelling for:

- New applications handling health data.
- Major changes affecting data flows or trust boundaries.
- Annual reviews of critical systems.
- Integration with new external partners.
- Following security incidents.

## Requirements

### Use structured methodology

Follow the [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process):

1. **Decompose** --- understand the system.
1. **Identify threats** --- use STRIDE methodology.
1. **Mitigate** --- define security controls.
1. **Validate** --- test controls work.

### Core deliverables

Teams **MUST** produce:

#### 1. System context

- High-level description and data sensitivity.
- User types and trust boundaries.
- Links to system architecture documentation.

#### 2. Data flow diagram

Simple diagram showing:

- Data stores with classifications (Personal, OFFICIAL, SECRET).
- External entities and trust relationships.
- Key processes and data movements.

Keep this high-level --- focus on trust boundaries, not implementation details.

#### 3. STRIDE threat analysis

For each component, systematically consider:

- **Spoofing**: Compromises authentication by impersonating something or someone else.
- **Tampering**: Compromises integrity by modifying data or code.
- **Repudiation**: Compromises identification by claiming to have not performed the action.
- **Information Disclosure**: Compromises confidentiality by exposing information to someone not authorized to see it.
- **Denial of Service**: Compromises availability by denying or degrading service to users.
- **Elevation of Privilege**: Compromises authorisation by gaining capabilities improperly.

#### 4. Risk assessment

- Rate impact (high/medium/low) and likelihood (high/medium/low).
- Prioritise on high impact or high likelihood threats first.
- Consider current threat intelligence from [National Cyber Security Centre (NCSC)](https://www.ncsc.gov.uk/section/keep-up-to-date/ncsc-news?q=&defaultTypes=news,information&sort=date%2Bdesc).

#### 5. Security controls

- Map existing controls to threats.
- Identify gaps requiring new controls.
- Document accepted risks with rationale.

### Implementation

#### Create actionable work

Transform threat model outputs into:

- Security user stories with clear acceptance criteria, linked to specific threats.
- Test scenarios for validation.

**Example user story**:

```
As a GP accessing patient records
I need to see only the health data for patients under my care
So that I cannot accidentally access confidential information about other patients

Acceptance criteria:
- When I search for a patient, I only see results for patients registered to my practice
- If I try to access a patient record directly (e.g., via URL), I get an access denied message if they're not my patient
- The system logs any attempt to access patient records outside my authorised list
- I can see a clear message explaining why access was denied
```

#### Documentation

- Store in version control alongside code.
- Update in line with system changes or within 30 days of new information emerging.
- Keep documentation lightweight --- diagrams and bullet points, not essays.

### Quality assurance

#### Reviews required

- **Peer review** for all threat models.
- **Security Architecture review** for systems handling personal health data or supporting critical functions.

#### Validation

- Test security controls against identified threats.
- Update threat models based on incident learnings.
- Annual review for critical systems.

## Team collaboration

### Shared resources

- Share threat models for reusable components.
- Contribute learnings to community of practice.

### Integration with SDLC

- Complete during design phase.
- Inform security testing strategy.
- Update as part of system changes.

## Tools

- **OWASP Threat Dragon** (recommended) --- free, browser-based, supporting STRIDE methodology with diagram creation and threat tracking.
- **Confluence diagrams plug-in** (draw.io): For creating and maintaining data flow diagrams.
- **UKHSA enterprise GitHub**: All threat models **SHOULD** be stored in version control systems alongside code repositories.

## Measurement

| ID   | Indicator                        | GREEN                                          | AMBER                        | RED                           |
| :--- | :------------------------------- | :--------------------------------------------- | :--------------------------- | :---------------------------- |
| TM-1 | Threat model coverage            | 100% of components                             | >80% coverage                | <80% coverage                 |
| TM-2 | Threat model currency            | Updated as part of system changes              | Updated within 30 days       | >30 days out of date          |
| TM-3 | Security controls implementation | All high-risk threats addressed                | Some medium-risk gaps        | High-risk threats unaddressed |
| TM-4 | Documentation quality            | Complete, accessible, peer-reviewed            | Minor gaps or limited review | Incomplete or not reviewed    |
| TM-5 | Integration with development     | Security stories in backlog, tests implemented | Some integration gaps        | Poor integration              |

## References

- [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process)
- [UKHSA Secure Development Lifecycle](./secure-development-lifecycle.md)
- [Government Security Classifications](https://www.gov.uk/government/publications/government-security-classifications)
