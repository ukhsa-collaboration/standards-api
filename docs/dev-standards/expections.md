# Exceptions

## Introduction

Exceptions are a formal mechanism for managing deviations from agreed standards. This guidance applies across all development standards, including security, architecture, environments, and delivery processes.

Exceptions **MUST** be used when a required control, pattern or practice cannot be followed due to valid constraints. They help ensure that risks are understood, documented and appropriately managed.

Exceptions **MUST NOT** be used to bypass standards without due diligence. All exceptions **MUST** be time-bound, reviewed regularly and approved at the appropriate level based on risk and subject matter.

## Guidance

### When to raise an exception

There are specific situations where an exception is required. Teams **MUST** raise an exception when:

- a required control or standard cannot be implemented due to technical, operational or business constraints
- a control is partially implemented or delayed beyond its expected timeline
- a control is replaced with an alternative that does not meet the original requirement

### Exception process

To ensure consistency and accountability, teams **MUST** follow a structured process:

- document the exception clearly, including the standard affected, reason for the exception and associated risks
- assess the risk level (**LOW**, **MEDIUM**, **HIGH**, **CRITICAL**) based on impact and likelihood
- define and implement compensating controls where possible
- specify a time limit for the exception and a review date
- submit the exception for approval based on the assessed risk level and subject matter

### Approval thresholds

The table below shows who is responsible for approving exceptions based on their risk level and subject matter:

| Risk level              | Security exceptions | Other exceptions                |
| ----------------------- | ------------------- | ------------------------------- |
| **LOW**                 | Technical Lead      | Technical Lead                  |
| **MEDIUM**              | Security Architect  | Solution or Technical Architect |
| **HIGH** / **CRITICAL** | Deputy Director     | Deputy Director                 |

### Ongoing management

Once approved, exceptions must be actively managed. Teams **MUST**:

- maintain an exception register with status tracking and review dates
- review **HIGH** and **CRITICAL** exceptions at least quarterly
- review **MEDIUM** and **LOW** exceptions at least annually
- update or close exceptions when the original constraint is resolved

## Roles and responsibilities

Clear roles help ensure that exceptions are handled consistently and reviewed by the right people:

- **Delivery teams** — responsible for identifying, documenting and proposing exceptions
- **Security Architect** — responsible for reviewing, advising and approving **MEDIUM** risk security exceptions
- **Solution or Technical Architect** — responsible for reviewing and approving **MEDIUM** risk non-security exceptions
- **Deputy Director** — responsible for reviewing and approving **HIGH** and **CRITICAL** risk exceptions
- **Technical leads** — responsible for approving **LOW** risk exceptions and ensuring compensating controls are in place

## Measurement

The following indicators help assess how well exceptions are being managed:

| ID   | Indicator                     | GREEN                                                | AMBER                             | RED                              |
| ---- | ----------------------------- | ---------------------------------------------------- | --------------------------------- | -------------------------------- |
| EX-1 | Exception documentation       | All exceptions documented with risk and rationale    | Some exceptions incomplete        | Exceptions undocumented          |
| EX-2 | Approval process followed     | Approved at correct level with compensating controls | Some approvals missing or delayed | No approval or bypassed process  |
| EX-3 | Time-bound and reviewed       | All exceptions time-bound and reviewed on schedule   | Some exceptions overdue           | Exceptions not reviewed          |
| EX-4 | Exception register maintained | Register up to date with status and review history   | Register partially maintained     | No register or tracking in place |

## References

- [NCSC Risk Management Guidance][1]
- [Software Development Lifecycle][2]

[1]: https://www.ncsc.gov.uk/collection/risk-management
[2]: ../dev-standards/sdlc.md
