# Secure Development Lifecycle (SDLC)

## Introduction
Security MUST be embedded throughout the software development lifecycle. Teams MUST take a DevSecOps approach, treating security and operations as intrinsic to the development process. This ensures that risks are identified and mitigated early, and that secure practices are consistently applied from planning through to deployment and maintenance.

## Policy Framework
This standard implements the NIST Secure Software Development Framework (SSDF) practices within UKHSA's development processes. Teams MUST follow these requirements as the minimum baseline for secure development.

## Guidance

### Process Requirements
- Teams MUST follow the [UKHSA SDLC](../sdlc.md) and integrate security activities into each phase aligned with NIST SSDF practices.
- Security gates MUST be defined and enforced through process controls at each SDLC stage as part of the definition of done, and where relevant in CI/CD pipelines.
- Security controls MUST be defined during planning and validated during testing.
- Teams MUST maintain traceability between security requirements, controls, and test results throughout the development lifecycle.

### Technical Standards
- Critical national infrastructure (CNI) applications MUST comply with [OWASP OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) Level 3 requirements. CNI applications are systems whose failure could impact national security, public safety, or economic stability.
- Applications processing personal or classified information MUST comply with OWASP ASVS Level 2 requirements as a minimum.
- All other applications MUST comply with OWASP ASVS Level 1 requirements as a minimum. These applications include internal tools, public information systems, abd lower-risk business applications.
- Teams MUST conduct security testing that validates compliance with applicable ASVS requirements.

### Training and Awareness
- All development team members MUST complete [OWASP Top 10](https://owasp.org/www-project-top-ten/) awareness training annually.
- Teams SHOULD participate in secure coding training specific to their technology stack.
- Security champions within development teams SHOULD receive advanced security training.

### Third-Party Components and Services
- Teams MUST evaluate third-party software and services against [Minimum Viable Secure Product (MVSP)](https://mvsp.dev/mvsp.en/) criteria before adoption.
- Third-party components MUST be maintained with current security patches.
- Teams MUST maintain an inventory of all third-party dependencies and regularly assess them for known vulnerabilities.

### Documentation and Compliance
- Teams MUST document security architecture decisions and their rationale.
- Security testing results MUST be recorded and any exceptions formally approved through the risk management process.
- Teams MUST maintain evidence of compliance with these standards for audit purposes.

## Delivery Activities

### Planning and Requirements
- **MUST:** Conduct [threat modelling](./threat-modelling.md) for new systems and major changes.
- **MUST:** Define security requirements based on data classification and risk assessment.
- **MUST:** Identify applicable ASVS requirements based on application risk tier.

### Design and Architecture
- **MUST:** Review architectural designs against security principles.
- **MUST:** Document security controls and their implementation approach.
- **SHOULD:** Conduct peer review of security architecture.

### Implementation
- **MUST:** Follow secure coding practices appropriate to technology stack.
- **MUST:** Implement automated security testing in CI/CD pipelines.
- **SHOULD:** Conduct regular code reviews with security focus.

### Testing and Validation
- **MUST:** Conduct security testing to validate ASVS requirements.
- **MUST:** Perform vulnerability scanning of applications and infrastructure.
- **SHOULD:** Conduct penetration testing for high-risk applications.

### Deployment and Operations
- **MUST:** Implement security monitoring and logging.
- **MUST:** Establish incident response procedures.
- **SHOULD:** Configure automated security alerting.

## Measurement

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SDLC-1 | Security checkpoints embedded in delivery workflows | Present in all phases with documented evidence | Present in some phases | Absent or undocumented |
| SDLC-2 | Traceability from backlog to security controls | Fully traceable with automated tracking | Partial traceability | No traceability |
| SDLC-3 | ASVS compliance validation | All applications tested against applicable ASVS level | High-risk applications tested only | No ASVS testing conducted |
| SDLC-4 | Security training completion | 100% team completion within required timeframes | 80-99% completion | <80% completion |
| SDLC-5 | Third-party component risk assessment | All components assessed against MVSP criteria | Critical components assessed only | No systematic assessment |
| SDLC-6 | Vulnerability management | All high/critical vulnerabilities remediated within SLA | Some high/critical vulnerabilities outstanding | Multiple high/critical vulnerabilities outstanding |

## References
- [NIST Secure Software Development Framework (SSDF)](https://csrc.nist.gov/Projects/ssdf)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Minimum Viable Secure Product (MVSP)](https://mvsp.dev/)
- [UKHSA Risk Management Framework](../risk-management.md)
