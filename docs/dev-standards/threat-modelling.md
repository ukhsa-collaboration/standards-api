# Threat modelling

## Introduction

Threat modelling is a structured approach to identifying and mitigating security risks early in the software delivery lifecycle. It helps teams design secure systems by understanding how data flows, where trust boundaries exist, and what threats may arise.

All systems **MUST** include threat modelling as part of their design and delivery process. This applies to **ALL** systems — regardless of size, sensitivity or criticality.

Threat modelling supports secure-by-design principles and helps ensure that appropriate controls are in place to protect public health data and maintain service availability.

## Guidance

### When to do threat modelling

Teams **MUST** carry out threat modelling:

- for **ALL** new systems
- for **ALL** existing systems undergoing significant change
- when integrating with new external partners or services
- after a security incident
- at least once a year for **ALL** systems

### How to do threat modelling

Teams **MUST** follow a structured approach such as the [OWASP Threat Modelling Process][3], which includes:

1. **Decompose the system** — understand the architecture, data flows and trust boundaries
2. **Identify threats** — use the STRIDE model to consider different types of risk
3. **Mitigate risks** — define and implement appropriate security controls
4. **Validate controls** — test that mitigations are effective

Threat modelling **MUST** be integrated into the design phase of the [SDLC][4] and **MUST** inform security testing and backlog planning.

### Required deliverables

Each threat model **MUST** include the following:

- **System context** — including data sensitivity, user types and trust boundaries
- **Data flow diagram** — showing key components, data stores and trust boundaries
- **STRIDE threat analysis** — identifying threats for each component
- **Risk assessment** — rating impact and likelihood
- **Security controls** — mapped to threats, with gaps identified
- **Security user stories** — added to the backlog with acceptance criteria
- **Validation plan** — describing how controls will be tested
- **Documentation** — stored in version control and updated regularly

Details of these deliverables are provided in the [Threat Modelling Appendix][5].

All threat models **MUST** be:

- Peer-reviewed within the delivery team
- Reviewed and approved by a **Security Architect**
- Updated within 30 days of any significant system change or new threat intelligence

## Measurement

Use these indicators to assess the quality and effectiveness of threat modelling:

| ID   | Indicator                       | GREEN                                                | AMBER                                    | RED                            |
| ---- | ------------------------------- | ---------------------------------------------------- | ---------------------------------------- | ------------------------------ |
| TM-1 | Threat model currency           | Updated within 30 days of changes or new threats     | Updated within 60 days                   | Outdated or not maintained     |
| TM-2 | Required deliverables completed | **ALL** required deliverables present and complete   | Some deliverables missing or incomplete  | Deliverables missing or absent |
| TM-3 | Review and assurance            | Reviewed by **Security Architect** and peer-reviewed | Peer-reviewed only                       | Not reviewed                   |
| TM-4 | Integration with development    | Security stories in backlog and controls validated   | Some stories or validation steps missing | No integration with delivery   |

## References

- [Government Security Classifications][1]
- [NCSC Threat Intelligence][2]
- [OWASP Threat Modelling Process][3]
- [Software Development Lifecycle][4]
- [Threat Modelling Appendix][5]

[1]: https://www.gov.uk/government/publications/government-security-classifications
[2]: https://www.ncsc.gov.uk/collection/building-a-security-operations-centre/threat-intelligence
[3]: https://owasp.org/www-community/Threat_Modeling_Process
[4]: ../dev-standards/sdlc.md
[5]: ../dev-standards/appendix/threat-modelling-deliverables.md
