# Threat Modelling

## Introduction
Threat modelling helps teams identify and mitigate risks early in the design phase. It ensures that security concerns are addressed proactively, that mitigations are built into the system from the start, and that security controls remain effective throughout the system lifecycle. Effective threat modelling provides the foundation for risk-based security decision making and enables teams to focus security efforts where they will have the greatest impact.

## Scope and Applicability
Threat modelling MUST be performed for:
- All new applications and services.
- Major changes to existing systems (including significant feature additions, architectural changes, or data handling modifications).
- Annual reviews of critical national infrastructure and high-risk systems.
- Systems handling new types of data or integrating with new external services.
- Following security incidents that may indicate gaps in the original threat model.

## Guidance

### Structured Methodology
- Teams MUST use a structured approach such as the [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process).

### Required Deliverables
All threat modelling exercises MUST produce the following deliverables:

#### 1. System Overview and Context
- High-level system description and business purpose.
- Data classification and sensitivity analysis.
- User types and access patterns.
- Trust boundaries and security perimeters.

#### 2. Data Flow Diagrams (DFDs)
- Comprehensive data flow diagrams (DFDs) showing:
  - Data stores and their sensitivity levels.
  - External entities and trust relationships.
  - Processes and their trust levels.
  - Data flows with classification labels.
- DFDs MUST be maintained as living documentation and updated with system changes.

#### 3. Attack Surface Analysis
- Complete inventory of:
  - Network interfaces and protocols.
  - Authentication and authorisation mechanisms.
  - Data input/output points.
  - Administrative interfaces.
  - Third-party integrations and APIs.
  - Physical access points where relevant.

#### 4. Threat Analysis
- Systematic analysis using STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege).
- Integration of relevant threat intelligence including:
  - Sector-specific attack patterns.
  - Nation-state threat actor capabilities and interests.
  - Current vulnerability trends in similar systems.
  - Historical incident patterns.

#### 5. Risk Assessment and Prioritisation
- Business impact assessment for each identified threat.
- Likelihood assessment based on threat intelligence and attack surface analysis.
- Risk prioritisation matrix with clear rationale.
- Mapping to organisational risk appetite and tolerance.

#### 6. Security Control Mapping
- Identification of existing security controls and their effectiveness against identified threats.
- Gap analysis highlighting areas requiring additional controls.
- Recommended security controls with implementation priority.
- Compensating controls for accepted risks.

### Implementation Requirements

#### Translation to Development Artefacts
- Threat model outputs MUST be translated into security user stories with clear acceptance criteria.
- Security requirements MUST be linked to specific threats and include testable criteria.
- Business impacts MUST be clearly defined in human-readable language for stakeholder understanding.
- Traceability MUST be maintained from threats through controls to test cases.

#### Documentation and Maintenance
- Threat models MUST be version-controlled alongside system architecture documentation.
- All threat models MUST be stored in accessible repositories with appropriate access controls.
- Updates MUST be triggered by:
  - Significant system changes.
  - New threat intelligence.
  - Security incidents affecting similar systems.
  - Annual review cycles (minimum).
  - Changes in business context or data handling.

#### Quality Assurance
- Threat models MUST undergo peer review by security-trained team members.
- Critical systems MUST have threat models reviewed by the assigned Security Architect.
- Regular validation MUST be conducted through:
  - Security testing aligned with identified threats.
  - Incident analysis to verify threat model accuracy.
  - Penetration testing focused on identified attack vectors.

### Cross-Team Collaboration

#### Threat Model Sharing
- Common components and services MUST have shared threat models accessible to all consuming teams.
- Threat intelligence and attack patterns MUST be shared across teams working on similar systems.
- Lessons learned from threat modelling exercises MUST be captured and shared through communities of practice.

#### Standardisation and Reuse
- Standard threat model templates MUST be maintained for common system architectures.
- Common threat patterns and controls MUST be documented in reusable libraries.
- Teams SHOULD leverage existing threat models for similar systems while ensuring appropriate customisation.

### Integration with Development Lifecycle

#### Planning and Design
- Threat modelling MUST be completed as part of the design process.
- Architectural decisions MUST consider threat model findings.
- Attack surface minimisation MUST be incorporated into architectural design.
- Security requirements derived from threat models MUST be included in project planning and estimation.
- Security controls MUST be designed to address identified threats.
- Threat model outcomes MUST inform security testing strategy and approach.

#### Implementation and Testing
- Security tests MUST validate effectiveness of controls against modelled threats.
- Vulnerability assessment MUST focus on identified attack vectors.
- Incident response procedures MUST address scenarios identified in threat models.

## Measurement

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| TM-1 | Threat models are version-controlled and maintained | Stored in repo, regularly updated, and linked to system changes | Stored in repo but updates lag behind system changes | Not version-controlled or significantly out of date |
| TM-2 | Security stories linked to delivery tickets | All identified threats mapped to stories with clear traceability | Most threats mapped with some gaps | Minimal or no linkage between threats and development work |
| TM-3 | Attack surface analysis completeness | Comprehensive attack surface documented with regular validation | Attack surface identified but not regularly validated | Incomplete or missing attack surface analysis |
| TM-4 | Data flow diagram accuracy | DFDs complete, current, and validated through testing | DFDs present but may not reflect current system state | DFDs missing or significantly inaccurate |
| TM-5 | Threat intelligence integration | Current threat intelligence integrated with evidence of regular updates | Some threat intelligence integrated but not regularly updated | No systematic threat intelligence integration |
| TM-6 | Cross-team threat model sharing | Threat models for shared components accessible and actively used by consuming teams | Threat models available but limited evidence of cross-team usage | No systematic sharing of threat models |
| TM-7 | Review and validation frequency | Threat models reviewed and validated according to schedule with evidence of updates | Some reviews conducted but not consistently | Reviews not systematically conducted or documented |
| TM-8 | Business impact articulation | Business impacts clearly defined, quantified where possible, and understood by stakeholders | Business impacts defined but may lack clarity or stakeholder understanding | Business impacts not clearly articulated or understood |

## Recommended Tools
- **Threat modelling tools**: [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/).
- **Diagramming tools**: diagrams.net Confluence plug-in (formerly draw.io).
- **Version control**: All threat models SHOULD be stored in version control systems alongside code. This SHOULD be in UKHSA enterprise GitHub.

## Integration with Incident Response

### Incident Analysis Integration
- Security-related post-incident reviews MUST include threat model validation and updates.
- Threat models SHOULD inform incident response runbook development.
- Attack scenarios from threat models SHOULD be included in incident response testing.

### Continuous Improvement
- Threat model accuracy MUST be validated through penetration testing and red team exercises.
- Threat modelling effectiveness SHOULD be measured through correlation with actual security incidents.
- Lessons learned from security incidents SHOULD feed back into threat modelling methodology improvements.

## References
- [OWASP Threat Modelling Process](https://owasp.org/www-community/Threat_Modeling_Process) (includes STRIDE)
- [NIST SP 800-154: Guide to Data-Centric System Threat Modeling](https://csrc.nist.gov/publications/detail/sp/800-154/draft)
- [UKHSA Risk Management Framework](../risk-management.md)
- [UKHSA Secure Development Lifecycle](./secure-development-lifecycle.md)