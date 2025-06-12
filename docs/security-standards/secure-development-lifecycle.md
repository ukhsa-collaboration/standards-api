# 2. Secure Development Lifecycle (SDLC)

## Introduction
Security must be embedded throughout the software development lifecycle. This ensures that risks are identified and mitigated early, and that secure practices are consistently applied from planning through to deployment and maintenance.

## Guidance
- Teams MUST follow the UKHSA SDLC and integrate security activities into each phase.
- Security gates MUST be defined and enforced in CI/CD pipelines.
- Teams SHOULD align with NIST SSDF practices.
- Security controls SHOULD be defined during planning and validated during testing.

## Measurement

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SDLC-1 | Security checkpoints embedded in delivery workflows | Present in all phases | Present in some phases | Absent |
| SDLC-2 | Traceability from backlog to security reviews | Fully traceable | Partial traceability | No traceability |
