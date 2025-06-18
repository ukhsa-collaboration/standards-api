# Secure Development Lifecycle (SDLC)

## Introduction
Security MUST be embedded throughout the software development lifecycle. Teams MUST take a DevSecOps approach, treating security and operations as intrinsic to the development process. This ensures that risks are identified and mitigated early, security controls are continuously validated, and secure practices are consistently applied from planning through to deployment and maintenance.

## Policy Framework
This standard implements the NIST Secure Software Development Framework (SSDF) practices within UKHSA's development processes. Teams MUST follow these requirements as the minimum baseline for secure development, with a risk-based approach that scales security controls appropriate to system criticality and data sensitivity.

## Guidance

### Process Requirements
- Teams MUST follow the [UKHSA SDLC](../sdlc.md) and integrate security activities into each phase aligned with NIST SSDF practices.
- Security gates MUST be defined and enforced through process controls at each SDLC stage as part of the definition of done, and where relevant in CI/CD pipelines.
- Security controls MUST be defined during planning, implemented with shift-left practices, and validated through continuous testing.
- Teams MUST maintain automated traceability between security requirements, controls, implementation, and test results throughout the development lifecycle.
- All security control exceptions MUST follow the formal risk acceptance process with appropriate compensating controls.

### Technical Standards
- Critical national infrastructure (CNI) applications MUST comply with [OWASP OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) Level 3 requirements. CNI applications are systems whose failure could impact national security, public safety, or economic stability.
- Applications processing personal or classified information MUST comply with OWASP ASVS Level 2 requirements as a minimum.
- All other applications MUST comply with OWASP ASVS Level 1 requirements as a minimum. These applications include internal tools, public information systems, abd lower-risk business applications.

### Training and Awareness
- All development team members MUST complete [OWASP Top 10](https://owasp.org/www-project-top-ten/) awareness training annually with demonstrated knowledge retention through assessment.
- Teams SHOULD participate in role-based secure coding training specific to their technology stack and responsibilities.
- Security champions within development teams MUST receive advanced security training and SHOULD participate in cross-organisational security communities of practice.
- Teams that operate live services SHOULD participate in regular security gaming exercises and tabletop scenarios to practice incident response.
- Recognition programmes SHOULD be implemented to acknowledge contributions to security improvement.

### Third-Party Components and Services
- Teams MUST evaluate third-party software and services against [Minimum Viable Secure Product (MVSP)](https://mvsp.dev/mvsp.en/) criteria before adoption.
- All third-party components MUST be documented in a Software Bill of Materials (SBOM) and maintained with current security patches.
- Teams MUST conduct supply chain risk assessment for critical dependencies, including vendor security posture evaluation.
- End-of-life planning MUST be documented for all third-party components where there is a known or expected end-of-life date, with migration strategies for unsupported software.
- Teams MUST perform vendor security assessment of cloud service providers appropriate to the data classification and system criticality.

### Documentation and Compliance
- Teams MUST document security architecture decisions, their rationale, and maintain these as living documentation.
- Security testing results MUST be recorded and any exceptions formally approved through the risk management process.
- Teams MUST maintain evidence of compliance with these standards for audit purposes through automated compliance reporting where possible.
- Teams that operate live services MUST create and maintain incident response runbooks as part of deployment activities.

## Delivery Activities

### Planning and Requirements
- **MUST:** Conduct [threat modelling](./threat-modelling.md) for new systems and major changes, including attack surface analysis and data flow documentation.
- **MUST:** Define security requirements based on application risk classification and threat model outputs.
- **MUST:** Identify applicable ASVS requirements and create security user stories with acceptance criteria.
- **MUST:** Plan security logging and monitoring requirements to support incident detection and response.
- **SHOULD:** Integrate sector-specific threat intelligence into threat models and security requirements.

### Design and Architecture
- **MUST:** Review architectural designs against security principles through security architecture review process.
- **MUST:** Document security controls, their implementation approach, and integration with incident response procedures.
- **MUST:** Design attack surface minimisation into system architecture.
- **SHOULD:** Conduct peer review of security architecture with cross-team collaboration for shared components.
- **SHOULD:** Present significant architectural changes to security architecture review board.

### Implementation
- **MUST:** Follow secure coding practices appropriate to technology stack with automated enforcement.
- **MUST:** Implement automated security testing in CI/CD pipelines with policy enforcement gates.
- **MUST:** Utilise standardised security control libraries where available.
- **MUST:** Implement comprehensive security logging and monitoring capabilities designed to support incident response activities.
- **SHOULD:** Implement shift-left security practices including IDE security plugins and pre-commit security hooks.
- **SHOULD:** Conduct regular code reviews with security focus and peer knowledge sharing.

### Testing and Validation
- **MUST:** Conduct automated security testing to validate ASVS requirements with continuous regression testing.
- **MUST:** Perform vulnerability scanning of applications and infrastructure with automated remediation tracking.
- **MUST:** Validate security logging and monitoring capabilities through testing scenarios.
- **SHOULD:** Conduct penetration testing for high-risk applications with findings integrated into security backlog.
- **SHOULD:** Perform attack surface analysis validation through testing.

### Deployment and Operations
- **MUST:** Implement comprehensive security monitoring and logging with automated alerting.
- **MUST:** Deploy incident response procedures with tested runbooks and escalation processes.
- **MUST:** Implement automated security alerting with defined response procedures.
- **SHOULD:** Conduct post-deployment security validation and monitoring effectiveness review.

### Maintenance and Evolution
- **MUST:** Conduct regular security control effectiveness reviews and updates.
- **MUST:** Perform post-incident security control reviews and improvements.
- **MUST:** Maintain threat models with regular updates based on changes and threat intelligence.
- **SHOULD:** Conduct annual security architecture reviews for critical systems.

## Exception Management

### Risk Acceptance Process
- Security control exceptions MUST be formally documented with business justification and risk assessment.
- Exceptions MUST be approved by appropriate authority based on risk level (Technical Lead for LOW, Security Team for MEDIUM, CISO for HIGH/CRITICAL risks).
- Compensating controls MUST be implemented where security controls cannot be fully applied.
- All exceptions MUST be time-bound with regular review cycles (quarterly for HIGH/CRITICAL, annually for MEDIUM/LOW).
- Exception registers MUST be maintained with status tracking and remediation planning.

## Measurement

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SDLC-1 | Security checkpoints embedded in delivery workflows | Present in all phases with automated enforcement and documented evidence | Present in some phases with manual enforcement | Absent or undocumented |
| SDLC-2 | Traceability from backlog to security controls | Fully traceable with automated tracking and real-time visibility | Partial traceability with manual processes | No traceability |
| SDLC-3 | ASVS compliance validation | All applications tested against applicable ASVS level with automated validation | High-risk applications tested with manual validation | No systematic ASVS testing |
| SDLC-4 | Security training effectiveness | 100% completion with demonstrated knowledge retention >80% | 80-99% completion or knowledge retention 60-80% | <80% completion or <60% knowledge retention |
| SDLC-5 | Third-party component risk assessment | All components assessed with SBOM and automated vulnerability tracking | Critical components assessed with manual tracking | No systematic assessment |
| SDLC-6 | Vulnerability management (MTTR) | High/Critical: <7 days, Medium: <30 days, Low: <90 days | High/Critical: <14 days, Medium: <60 days, some SLA breaches | Multiple SLA breaches or no systematic tracking |
| SDLC-7 | Security debt management | Security debt tracked and actively managed with remediation plans | Security debt identified but limited remediation | Security debt not systematically tracked |
| SDLC-8 | Shift-left security adoption | IDE plugins and pre-commit hooks deployed with high usage rates | Partial deployment or low usage rates | Not implemented |
| SDLC-9 | Exception management | All exceptions properly documented, approved, and reviewed within timeframes | Some exceptions properly managed | Exceptions not systematically managed |
| SDLC-10 | Incident response preparedness | Runbooks tested and up-to-date, logging validated, response times met | Runbooks exist but not regularly tested | Inadequate incident response capabilities |

## Cross-Team Coordination

### Security Architecture Review Board
- Significant architectural changes affecting multiple teams or critical systems MUST be reviewed by the Security Architecture Review Board.
- Review board MUST include representatives from security, architecture, and operational teams.
- Standardised security control libraries MUST be maintained and shared across teams.
- Cross-team threat model sharing MUST be implemented for common components and services.

### Communities of Practice
- Security champions MUST participate in cross-organisational security communities of practice.
- Regular knowledge sharing sessions SHOULD be conducted to share security lessons learned and best practices.
- Security control libraries and threat model templates SHOULD be collaboratively maintained.

## Implementation Guidance

### Phased Rollout Approach
1. **Phase 1**: Implement enhanced standards for all CNI and high-risk applications
2. **Phase 2**: Extend to personal data and classified information systems
3. **Phase 3**: Apply to all standard applications with appropriate scaling

### Tooling and Support
- Standardised security tooling MUST be provided to reduce implementation burden
- Security control libraries MUST be developed for common government use cases
- Templates and automation MUST be provided for threat modelling and security testing
- Self-service security assessment tools SHOULD be made available for teams

## References
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Minimum Viable Secure Product (MVSP)](https://mvsp.dev/)
- [UKHSA Risk Management Framework](../risk-management.md)
- [UKHSA Threat Modelling Standard](./threat-modelling.md)
- [Government Security Classifications](https://www.gov.uk/government/publications/government-security-classifications)