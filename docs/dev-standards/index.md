# Development Standards

## Introduction

At UKHSA, we build and operate digital services that support public health outcomes. To ensure these services are secure, reliable and maintainable, we follow a consistent set of engineering standards. These standards reflect industry best practice and are tailored to the unique needs of public sector delivery, including regulatory compliance, data protection and operational resilience.

This guidance provides a shared foundation for how we design, build, test and operate software. It promotes collaboration across disciplines, supports continuous improvement and ensures that quality and security are embedded from the outset — not added as an afterthought.

## Scope and audience

These standards apply to all software development activities at UKHSA, including internal tools, public-facing services and third-party integrations. They cover the full software delivery lifecycle (SDLC), from planning and design through to deployment, monitoring and decommissioning.

Intended audience:

- Software engineers and developers
- Technical architects and engineering leads
- Product managers and delivery leads
- Security champions and assurance professionals

## How to read the guidelines

The following terms are used throughout this guidance to indicate the strength of each requirement. These are adapted from [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) and contextualised for UKHSA:

- **MUST**: This requirement is mandatory. It applies universally and must be followed without exception unless formally approved.
- **MUST NOT**: This action is explicitly prohibited. It must not be taken under any circumstances unless an approved exception is in place.
- **SHOULD**: This is a strong recommendation. There may be valid reasons to deviate, but the implications must be understood, justified and documented.
- **SHOULD NOT**: This is a strong recommendation against a practice. Exceptions may exist, but they must be carefully considered, justified and documented.
- **MAY**: This is an optional practice or recommendation. Teams may choose to adopt it based on context, value or preference.

## Using these guidelines

Each section of this site addresses a specific aspect of software development, including security, environments, quality assurance and measurement. Teams are expected to apply these standards consistently, and to document any exceptions with appropriate justification.
