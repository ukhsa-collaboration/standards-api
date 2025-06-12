# 3. DevSecOps Patterns

## Introduction
DevSecOps patterns provide a structured way to embed security into the software delivery process. These patterns help teams apply consistent, repeatable practices that scale across services and teams.

## Guidance
- Teams MUST apply threat modelling, MVSP, and defence-in-depth patterns during design.
- Security patterns SHOULD be documented and reviewed regularly.
- Teams MAY extend patterns to meet specific risk profiles.
- Security MUST be treated as a product function, not a bolt-on.

## Measurement

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| DSP-1 | Security patterns referenced in architecture docs | Referenced and version-controlled | Referenced informally | Not referenced |
| DSP-2 | Threat modelling and MVSP reviews completed | For all services | For some services | Rarely or never done |
