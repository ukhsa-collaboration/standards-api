# Environments

## Introduction

Environments are isolated, purpose-specific spaces used to build, test, and operate software throughout the software delivery lifecycle. They help teams manage risk, validate changes, and ensure that systems are secure, reliable, and compliant before reaching users.

This guidance defines the environments we use, the data allowed in each, the required quality checks, and the responsibilities for managing them. It supports consistent, auditable delivery practices and aligns with security and governance expectations.

## Guidance

### Environment principles

To ensure consistency and control across delivery teams, environments must be defined and managed according to a set of shared principles. These principles support secure-by-design practices and enable traceability, reproducibility, and compliance.

Teams **MUST**:

- define all environments in code using Infrastructure as Code (IaC)
- use only approved data types in each environment
- apply the required quality checks before promoting changes
- ensure environments are reproducible and consistent
- document promotion and deployment processes
- define responsibilities for testing, validation, and deployment

### Environment sizing

Environment sizing helps teams choose the right scale for the right purpose. Lightweight environments are fast and cost-effective, while full-scale environments replicate production conditions for high-assurance testing.

- **Lightweight**: Fast to provision, low-cost, not production-scale. Used for development, testing, and training.
- **Full-scale**: Mirrors production scale and configuration. Used for staging and live operation.

### Environment types

Each environment has a defined purpose, size, and data classification. The table below summarises the key characteristics:

| Environment            | Size        | Data allowed            | Purpose                     | Who uses it              |
| ---------------------- | ----------- | ----------------------- | --------------------------- | ------------------------ |
| Local development      | Lightweight | Synthetic only          | Feature development         | Engineers                |
| Continuous integration | Lightweight | Synthetic only          | Automated validation        | CI/CD pipeline           |
| Pull request           | Lightweight | Synthetic only          | Branch-specific testing     | Engineers, testers       |
| Development            | Lightweight | Synthetic only          | Integrated testing          | Engineers, testers       |
| Quality assurance      | Lightweight | Synthetic only          | Formal testing              | QA, product owners       |
| Pre-production         | Full-scale  | Synthetic or anonymised | Final staging               | QA, security, operations |
| Production             | Full-scale  | Live (including PII)    | Live service                | Users, operations        |
| Training               | Lightweight | Synthetic only          | Training and demonstrations | Trainers, stakeholders   |

#### Local development

Local development environments are used by individual engineers to build and test features before sharing them with the team. These environments are fast, isolated, and ideal for early validation.

- **MUST** use only synthetic test data
- **MUST** run unit tests before committing code
- **MUST** perform exploratory testing
- **SHOULD** run linting, static analysis and dependency checks

#### Continuous integration (CI)

CI environments are ephemeral and automatically provisioned to validate changes on every pull request. They help catch issues early and enforce baseline quality standards.

- **MUST** run on every pull request
- **MUST** include unit tests, linting, static analysis and dependency checks
- **MUST** block merge if any required checks fail
- **SHOULD** include automated accessibility testing

#### Pull request (PR)

PR environments are optional, short-lived environments used to test specific branches before merging. They support exploratory testing and stakeholder review.

- **MUST** be automatically destroyed after the PR is merged or closed
- **MUST** support exploratory testing by a tester or product owner

#### Development

The development environment is shared by the team and used for integrated testing after code is merged to `main`. It helps validate that components work together as expected.

- **MUST** deploy all team-owned components
- **MUST** support exploratory testing if no PR environment exists
- **SHOULD** stub or mock external dependencies

#### Quality assurance (QA)

QA environments are stable and used for formal testing, including regression and user acceptance testing. They provide a controlled space for validating system behaviour.

- **MUST** be deployed manually
- **MUST** run full system regression tests
- **MUST** deploy all team-owned components
- **SHOULD** include user acceptance testing (UAT)
- **SHOULD** stub or mock external dependencies

#### Pre-production

Pre-production environments replicate production scale and configuration. They are used for final staging, performance testing, and security validation before go-live.

- **MUST** mirror production configuration
- **MUST** include all integrations
- **MUST** run functional sanity checks
- **MUST** perform penetration and performance testing at agreed intervals
- **SHOULD** use non-production instances of external services

#### Production

The production environment serves real users and handles live data. It must be fully monitored, resilient, and secure.

- **MUST** include all production components
- **MUST** run smoke tests after deployment
- **MUST** trigger alerts on failure

#### Training

Training environments are used for demonstrations and onboarding. They replicate production configuration but use only synthetic data.

- **MUST** match production configuration
- **MUST** use only test data

## Measurement

Measurement indicators help teams assess how well environments are defined, managed, and used. These indicators support continuous improvement and audit readiness.

| ID    | Indicator                    | GREEN                        | AMBER                         | RED                    |
| ----- | ---------------------------- | ---------------------------- | ----------------------------- | ---------------------- |
| ENV-1 | Environments defined in code | All environments IaC-managed | Some environments IaC-managed | Not reproducible       |
| ENV-2 | Responsibilities defined     | Clear ownership for each     | Partial or informal ownership | No ownership defined   |
| ENV-3 | Data usage                   | Correct data type in each    | Occasional misuse             | Live data in non-prod  |
| ENV-4 | Quality checks applied       | All checks run and pass      | Some checks missing           | No checks applied      |
| ENV-5 | Promotion process            | Manual or gated promotion    | Ad hoc promotion              | Uncontrolled promotion |
