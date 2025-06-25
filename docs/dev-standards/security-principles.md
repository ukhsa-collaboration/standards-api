# Security Principles

## Introduction

Security principles form the foundation of secure software engineering. They guide how teams think about risk, design systems, and make decisions throughout the delivery lifecycle. These principles ensure that security is not an afterthought but a core part of how UKHSA builds and operates digital services.

## Guidance

- All software developed at UKHSA **MUST** be secure by design, incorporating security considerations from initial conception through to decommissioning.
- Security **MUST** be considered at every SDLC phase as outlined in the [Secure Development Lifecycle](secure-development-lifecycle.md), NOT treated as a post-development activity.
- Teams **MUST** adopt a defence-in-depth approach, implementing multiple layers of security controls rather than relying on single points of protection.
- Teams **MUST** apply the principle of least privilege, ensuring users and systems have only the minimum access necessary to perform their functions.
- Teams **MUST** implement fail-safe defaults, ensuring that systems default to a secure state when controls fail or are bypassed.
- Teams **SHOULD** apply zero trust principles, verifying and authorising every transaction regardless of location or user credentials.

## Measurement

| ID   | Indicator                                                     | GREEN                                                | AMBER                                 | RED                        |
| ---- | ------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------- | -------------------------- |
| SP-1 | Security principles are documented in team ways of working    | Documented and reviewed quarterly                    | Documented but not regularly reviewed | Not documented             |
| SP-2 | Security is considered during architecture and design reviews | Security is a standing agenda item in design reviews | Security is discussed ad hoc          | Security is not considered |
| SP-3 | Threat modelling completed for new systems                    | Completed for all new systems and major changes      | Completed for high-risk systems only  | Not completed              |
