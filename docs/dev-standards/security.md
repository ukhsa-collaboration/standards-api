# Security

## Introduction

Security is a core part of how we design, build and operate digital services. Applying consistent security principles helps teams make informed decisions, reduce risk, and build systems that are resilient by default.

Security must be considered from the outset and throughout the software delivery lifecycle — not added as an afterthought.

## Guidance

Teams **MUST**:

- design systems to be secure by default, from initial concept through to decommissioning
- consider security at every phase of the software delivery lifecycle
- adopt a defence-in-depth approach, using multiple layers of security controls
- apply the principle of least privilege to all users, systems and services
- implement fail-safe defaults so that systems remain secure if controls fail

Teams **SHOULD**:

- apply zero trust principles, verifying and authorising every request regardless of origin

## Measurement

Use these indicators to assess how well security principles are embedded in team practices.

| ID    | Indicator                                        | GREEN                                                   | AMBER                                 | RED                        |
| ----- | ------------------------------------------------ | ------------------------------------------------------- | ------------------------------------- | -------------------------- |
| SEC-1 | Security principles documented in team practices | Documented and reviewed quarterly                       | Documented but not regularly reviewed | Not documented             |
| SEC-2 | Security considered throughout the SDLC          | Evident in planning, design, implementation and testing | Considered in some phases only        | Not considered             |
| SEC-3 | Defence-in-depth approach applied                | Multiple layers of controls implemented                 | Some layers present but inconsistent  | Single point of protection |
| SEC-4 | Least privilege enforced                         | All roles and systems scoped to minimum access          | Some roles overly permissive          | No access control strategy |
| SEC-5 | Fail-safe defaults implemented                   | Secure defaults applied across all components           | Defaults applied inconsistently       | Defaults are insecure      |
