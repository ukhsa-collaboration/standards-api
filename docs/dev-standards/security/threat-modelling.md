# Threat Modelling Policy and Guidance

## Introduction

Threat modelling is a systematic approach to identifying and mitigating security risks during system design. This policy ensures that UKHSA systems are designed with security considerations from the outset, reducing the likelihood of security incidents and ensuring public health data remains protected. Effective threat modelling provides the foundation for risk-based security decision making and enables teams to focus security efforts where they will have the greatest impact.

**Policy objective**: All UKHSA systems MUST be designed with comprehensive threat analysis to protect public health data and maintain service availability for critical health functions.

## Scope and Applicability

Teams MUST perform threat modelling for:
- All new applications and services handling health data.
- Major changes to existing systems (significant feature additions, architectural changes, or changes to data handling).
- Annual reviews of systems supporting critical functions.
- Systems integrating with new external partners.
- Systems handling new types of data or integrating with new external services.
- Following security incidents that may indicate gaps in the original threat model.

**Example scenarios requiring threat modelling**:
- Developing a new disease surveillance system.
- Adding genomic sequencing data to an existing laboratory information system.
- Integrating with a new NHS system.
- Creating public-facing dashboards for outbreak monitoring.

## Policy Requirements

### Structured Methodology
Teams MUST use a structured approach following the [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process), supplemented by [NIST Secure Software Development Framework (SSDF)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) for more complex or high risk/impact systems.

**Actionable requirement**: Teams must complete all four stages of the OWASP process:

1. Decompose the application
1. Determine and rank threats
1. Determine countermeasures and mitigation
1. Review results and test implementation.

### Required Deliverables
All threat modelling exercises MUST produce the following deliverables:

#### 1. System Overview and Context
Teams MUST document:
- High-level system description.
- Data classification and sensitivity analysis using the [Government Security Classifications Policy](https://www.gov.uk/government/publications/government-security-classifications).
- User types and access patterns.
- Trust boundaries between UKHSA, NHS, and external organisations.

#### 2. Data Flow Diagrams (DFDs)
Teams MUST create comprehensive data flow diagrams following NIST SSDF guidance, showing:
- Data stores with sensitivity classifications (Personal, Special Category, OFFICIAL, OFFICIAL-SENSITIVE, SECRET).
- External entities (NHS trusts, laboratories, partner agencies, public users) with trust relationships.
- Processes and their trust levels, clearly indicating where data transformation or aggregation occurs.
- Data flows with classification labels showing data movement between trust boundaries.

DFDs MUST be maintained as living documentation and updated within 30 days when system changes affect data flows or trust relationships.

#### 3. Attack Surface Analysis
Teams MUST provide complete inventory of the following. References/links to infrastructure as code is a good way to do this.
- Network connections and protocols, including all ports, services, and firewall rules.
- Authentication and authorisation mechanisms for health professionals and partner organisations, specifying credential types and access controls.
- Data input/output points (laboratory feeds, clinical systems, manual data entry) with validation mechanisms.
- Administrative interfaces for system management, including privileged access controls.
- Third-party integrations and APIs with NHS and partner systems, including API security measures.
- Physical access points where relevant (data centres, workstations, mobile devices).

Where not automatically generated, the attack surface inventory must be validated, preferably through automated scanning tools, or where impractical then by manual verification.

#### 4. Threat Analysis Using STRIDE
Teams MUST conduct systematic threat analysis using the STRIDE methodology, considering:
- **Spoofing**: Compromises authentication by impersonating something or someone else.
- **Tampering**: Compromises integrity by modifying data or code.
- **Repudiation**: Compromises identification by claiming to have not performed the action.
- **Information Disclosure**: Compromises confidentiality by exposing information to someone not authorized to see it.
- **Denial of Service**: Compromises availability by denying or degrading service to users.
- **Elevation of Privilege**: Compromises authorisation by gaining capabilities improperly.

Teams MUST incorporate current threat intelligence from the [National Cyber Security Centre (NCSC)](https://www.ncsc.gov.uk/section/keep-up-to-date/ncsc-news?q=&defaultTypes=news,information&sort=date%2Bdesc).

#### 5. Risk Assessment and Prioritisation
Teams MUST assess risks using a structured approach:
- **Business impact assessment** for each identified threat, quantified where possible (service downtime, data breach costs, public health response delays).
- **Likelihood assessment** based on threat intelligence, attack surface analysis, and historical incident data.
- **Mapping to organisational risk appetite and tolerance** as defined in UKHSA enterprise risk management policies.
- **Resultant risk prioritisation** with clear rationale linking technical risk to business and public health impacts.

#### 6. Security Control Mapping
Teams MUST provide:
- **Identification of existing security controls** and their effectiveness against identified threats.
- **Gap analysis** highlighting areas requiring additional controls, with specific reference to applicable security standards.
- **Recommended security controls** with implementation priority, cost estimates, and resource requirements.
- **Compensating controls** for accepted risks, including monitoring and detection capabilities.
- **Clinical safety considerations** for security controls that might affect health professional workflows or patient care delivery.

### Implementation Requirements

#### Translation to Development Artefacts
Teams MUST translate threat model outputs into actionable development work:
- **Security user stories** with clear acceptance criteria linked to specific threats and testable security requirements.
- **Security requirements** that address identified threats while maintaining clinical workflow efficiency, with defined success criteria.
- **Business impacts** clearly articulated in language understandable to clinical and public health stakeholders.
- **Traceability** maintained from threats through controls to test cases, using requirements management tools where available.

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

#### Documentation and Maintenance
Teams MUST ensure:
- **Version control**: All threat models stored in UKHSA enterprise GitHub alongside system architecture documentation with appropriate access controls.
- **Accessibility**: Threat models stored in searchable repositories with metadata tags for system type, data classification, and threat categories.
- **Update triggers**: Reviews must be completed within 30 days of significant system changes, new threat intelligence affecting similar systems, security incidents, annual review cycles (minimum), or changes in business context or data handling requirements.
- **Change tracking**: All updates must include rationale, impact assessment, and approval from designated security reviewers.

#### Quality Assurance
Teams MUST implement quality assurance processes:
- **Peer review**: All threat models undergo review by team members with documented security training (minimum 8 hours annually).
- **Security architecture review**: Systems handling personal health data or supporting critical public health functions require review by UKHSA Security Architecture team before production deployment.
- **Regular validation** through security testing aligned with identified threats, incident analysis to verify threat model accuracy, and penetration testing focused on identified attack vectors.

**Actionable requirement**: Quality assurance must follow documented checklists covering completeness, accuracy, and alignment with security standards. Review outcomes must be documented with specific approval criteria and remediation requirements.

### Cross-Team Collaboration Requirements

#### Threat Model Sharing
Teams MUST facilitate collaboration through:
- **Common component threat models**: Shared threat models for reusable health system components accessible to all consuming teams through centralised repository.
- **Threat intelligence sharing**: Attack patterns and mitigation strategies shared across teams working on similar health systems through monthly community of practice meetings.
- **Lessons learned capture**: Insights from threat modelling exercises documented and shared through UKHSA security knowledge base with searchable tags and use case examples.

#### Standardisation and Reuse
Teams MUST leverage standardisation:
- **Standard threat model templates** maintained for common health system architectures (surveillance systems, laboratory information management, public dashboards, clinical decision support systems).
- **Common threat pattern libraries** documenting recurring threats, attack vectors, and proven countermeasures for health sector applications.
- **Existing threat model reuse**: Teams should leverage previous threat models for similar systems while ensuring appropriate customisation for specific health use cases and data types.

### Integration with Development Lifecycle

#### Planning and Design Phase Requirements
Teams MUST integrate threat modelling into early development phases:
- **Design integration**: Threat modelling completed as part of system design process, with architectural decisions informed by threat model findings.
- **Attack surface minimisation**: Security controls designed to reduce attack surface while maintaining clinical functionality and regulatory compliance.
- **Planning integration**: Security requirements derived from threat models included in project planning, resource estimation, and delivery timelines.
- **Testing strategy**: Threat model outcomes inform security testing approach, vulnerability assessment priorities, and penetration testing scenarios.

#### Implementation and Testing Requirements
Teams MUST validate threat model assumptions:
- **Security testing**: Tests validate effectiveness of implemented controls against modelled threats using automated and manual testing approaches.
- **Vulnerability assessment**: Focus on attack vectors identified in threat models, with particular attention to health data protection and clinical workflow integrity.
- **Incident response preparation**: Procedures address scenarios identified in threat models, including health-specific incident types (clinical data compromise, outbreak response disruption).

## Compliance Monitoring

Teams will be assessed against the following criteria:

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| TM-1 | Threat models are version-controlled and maintained | Stored in UKHSA GitHub, regularly updated within required timescales, and linked to system changes with full audit trail | Stored in version control but updates occasionally lag behind system changes (up to 60 days) | Not version-controlled or significantly out of date (>90 days behind system state) |
| TM-2 | Security stories linked to delivery tickets | All identified high/medium threats mapped to stories with clear traceability and acceptance criteria | Most threats mapped with some minor gaps in traceability or acceptance criteria | Minimal or no linkage between threats and development work |
| TM-3 | Attack surface analysis completeness | Comprehensive attack surface documented, validated through scanning, and regularly updated | Attack surface identified but validation may be incomplete or infrequently updated | Incomplete attack surface analysis or missing critical components |
| TM-4 | Data flow diagram accuracy | DFDs complete, current, validated through testing, and accurately reflect production system architecture | DFDs present but may not fully reflect current system state or have minor inaccuracies | DFDs missing, significantly inaccurate, or not validated against actual system |
| TM-5 | Threat intelligence integration | Current threat intelligence from NCSC, NHS Digital, and health sector feeds integrated with evidence of regular updates (monthly) | Some threat intelligence integrated but updates may be inconsistent (quarterly) | No systematic threat intelligence integration or updates older than 6 months |
| TM-6 | Cross-team threat model sharing | Threat models for shared components accessible and actively used by consuming teams with evidence of reuse | Threat models available but limited evidence of cross-team usage or collaboration | No systematic sharing of threat models or collaborative approach |
| TM-7 | Review and validation frequency | Threat models reviewed according to schedule with documented evidence of updates and validation activities | Some reviews conducted but may not consistently meet required timescales | Reviews not systematically conducted, documented, or meeting minimum frequency requirements |
| TM-8 | Business impact articulation | Business and public health impacts clearly defined, quantified where possible, and understood by clinical and management stakeholders | Business impacts defined but may lack quantification or full stakeholder understanding | Business impacts not clearly articulated, understood, or linked to organisational priorities |

## Recommended Tools and Templates

**Threat Modelling Tools**:
- **OWASP Threat Dragon** (preferred for new teams): Free, browser-based tool supporting STRIDE methodology with diagram creation and threat tracking.
- **Microsoft Threat Modeling Tool**: Desktop application with extensive threat libraries and integration with Microsoft development tools.

**Documentation and Diagramming**:
- **Confluence diagrams plug-in** (draw.io): For creating and maintaining data flow diagrams with version control integration.
- **UKHSA enterprise GitHub**: All threat models SHOULD be stored in version control systems alongside code repositories.

**Framework Integration**:
- **NIST Cybersecurity Framework mapping templates**: Available in UKHSA Security Architecture repository for control mapping and gap analysis.
- **NHS Data Security and Protection Toolkit alignment guide**: Specific guidance for mapping threat model outputs to NHS DSP Toolkit requirements.

## Integration with Incident Response

### Incident Analysis Integration Requirements
Following security incidents affecting health data or public health functions:
- **Post-incident threat model review**: Teams MUST review and update threat models within 14 days to address identified gaps or assumptions.
- **Incident response integration**: Threat models SHOULD inform incident response runbook development and recovery procedures.
- **Exercise integration**: Attack scenarios from threat models SHOULD be included in incident response testing and tabletop exercises.

### Continuous Improvement Requirements
Teams MUST participate in continuous improvement:
- **Threat model validation**: Accuracy validated through regular penetration testing focused on health data scenarios and red team exercises simulating nation-state attacks on health infrastructure.
- **Effectiveness measurement**: Correlation of threat model predictions with actual security incidents to identify methodology gaps and improvement opportunities.
- **Methodology enhancement**: Lessons learned from security incidents feed back into threat modelling methodology improvements and template updates.

## Governance and Compliance

This policy supports UKHSA's compliance with:
- **UK GDPR** requirements for health data protection and privacy by design principles.
- **NHS Data Security and Protection Toolkit** mandatory security standards for health and care organisations.
- **Government Security Classifications Policy** for appropriate handling of OFFICIAL and OFFICIAL-SENSITIVE health data.
- **Clinical governance requirements** for health information systems supporting patient care and public health functions.
- **NIST Cybersecurity Framework** core functions of Identify, Protect, Detect, Respond, and Recover.

**Non-compliance consequences**:
- Increased security review requirements and delayed system deployments.
- Escalation to UKHSA Chief Information Security Officer and senior management.
- Potential regulatory action for systems handling personal health data.
- Exclusion from NHS Digital approved supplier lists for external contractors.

## Support and Training

Teams requiring support with threat modelling should contact:
- **UKHSA Security Architecture team** (security.architecture@ukhsa.gov.uk) for review of critical health systems and methodology guidance.
- **Development Community of Practice** (monthly meetings, third Thursday) for peer support and template sharing.
- **NHS Digital Security team** for guidance on health sector threat intelligence and NHS-specific requirements.

**Training requirements**: All team members involved in threat modelling must complete UKHSA Security Awareness training annually, with additional threat modelling specific training available through the Learning Management System.

## References
- [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process) (includes STRIDE methodology).
- [NIST SP 800-154: Guide to Data-Centric System Threat Modeling](https://csrc.nist.gov/publications/detail/sp/800-154/final).
- [UKHSA Risk Management Framework](../risk-management.md).
- [UKHSA Secure Development Lifecycle](./secure-development-lifecycle.md).
- [Government Security Classifications Policy](https://www.gov.uk/government/publications/government-security-classifications).
- [NHS Data Security and Protection Toolkit](https://www.dsptoolkit.nhs.uk/).