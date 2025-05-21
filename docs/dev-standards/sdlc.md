# SDLC

## Overview

Changes are developed in a [local development environment](#dev-environment) and committed to a feature branch. When the feature is complete, a Pull Request (PR) is created.

``` mermaid
flowchart LR
    L[Local<br>dev env] -->|commit/<br>push| FB([Feature<br>branch])
    click L "#local-environment"
    FB -->|create| PR([Pull<br>request])
```

The PR triggers the [CI build](#ci-environment). Peer approval MUST be given and the CI build MUST pass for code to be merged to `main`.

``` mermaid
flowchart LR
    PR([Pull<br>request]) -->|trigger| CI([CI]) -->|build in| CIE[CI env]
    click CIE "#ci-environment"
    CI -.->|"(optional)<br>deploy"| PRE[Pull Request<br>environment] --- A@{ shape: comment, label: "Ephemeral<br>environment<br>for each PR" }
    click PRE "#pull-request-environment"
    PR -->|approval| Me([Merge])
    CI -->|pass| Me
    Me -->|commit/<br>push| M([main])
```

Once changes are merged to `main`, a build is performed and changes are deployment to the QA environment. Changes are progressed through environments once quality checks have passed in each.

``` mermaid
flowchart LR
    M([main]) -->|deploy| Dev[Dev<br>env]
    Dev -->|deploy| QA[QA<br>env]
    click Dev "#dev-environment"
    QA -->|deploy| PP[Preprod<br>environment]
    click QA "#qa-environment"
    PP -->|deploy| Pr[Production<br>environment]
    click PP "#preprod-environment"
    Pr -->|deploy| Tr[Training<br>environment]
    click Pr "#production-environment"
    click Tr "#training-environment"
```

## Environments

### Terminology

#### Size

- **Small**: smaller than production scale.
- **Large**: production scale.

#### Quality checks

The listed checks MUST or SHOULD be run and pass before changes are promoted to the next environment, as indicated.

#### Data

- **Test data only**: This SHOULD be synthetic data, created with scripts. As an alternative, this COULD be anonymised live data but this requires care to ensure GDPR compliance. Test data MUST NOT contain [Personal Information (PI)](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/personal-information-what-is-it/what-is-personal-information-a-guide/).
- **Live**: Live data, possibly including PI.

### All environments

All environments MUST be defined in code so that they can be created/re-created and brought to a known state automatically.

### Local environment

**Description**:

- Environment used for local development of features.
- Typically runs on a developer's personal machine or cloud-hosted development environment.
- Every developer MUST use their own local development environment and perform at a minimum the quality checks indicated as MUST below.
- Components other than that under development MAY be stubbed or mocked.

**Size**: Small

**Quality checks**

1. Exploratory testing by developer MUST be done to perform basic validation of changes.
1. Unit tests MUST be run and pass.
1. Linting SHOULD be run and pass.
1. Static code analysis SHOULD be run and pass.
1. Dependency checks SHOULD be run and pass.

**Data**: Test data only

**What next**: When feature is complete and testing all passes, create a Pull Request.

### CI environment

**Description**:

- All changes MUST be validated in a Continuous Integration (CI) environment before merging to `main`.
- This is an environment within the CI system, and is typically ephemeral (using containers) or hosted on dedicated VMs.

**Size**: Small

**Quality checks**

1. Unit tests MUST be run and pass.
1. Linting MUST be run and pass.
1. Static code analysis MUST be run and pass.
1. Dependency checks MUST be run and pass.
1. Automated accessibility testing SHOULD be run and pass.

**Data**: Test data only

**What next**: When all checks pass and approval is granted then automatically deploy to [Dev](#dev-environment).

### Pull Request environment

**Description**:

- This environment is optional.
- If present, this is an ephemeral environment to which the changes on a single branch are deployed when an associated PR is created.
- This environment will usually be cloud hosted and MUST be automatically destroyed when the PR is merged or cancelled.

**Size**: Small

**Quality checks**: Exploratory testing MUST be performed to provide validation of the changes. This is usually done by a specialist tester or Product Owner.

**Data**: Test data only

**What next**: When testing is completed successfully, approve the PR.

### Dev environment

**Description**:

- Typically long-lived environment which is generally unstable because every merge to `main` will trigger a deployment to this environment.
- In contrast to the [Local](#local-environment) environment, all components that the team is responsible for MUST be deployed in this environment, though external dependencies MAY be stubbed or mocked.

**Size**: Small

**Quality checks**: If there is no Pull Request environment, then exploratory testing MUST be performed to provide validation of the changes. This is usually done by a specialist tester or Product Owner.

**Data**: Test data only

**What next**: Manually trigger deployment to [QA](#qa-environment), timed to avoid disrupting quality assurance activities being performed in that environment. 

### QA environment

**Description**: 

- Typically long-lived environment which is generally stable because changes are deployed to this environment in a controlled manner to avoid disrupting tests while they are being performed.
- Deployments to this environment MUST be triggered by a manual approval step.
- Like the [Dev](#dev-environment) environment, all components that the team is responsible for MUST be deployed in this environment, though external dependencies MAY be stubbed or mocked.

**Size**: Small

**Quality checks**

1. User acceptance testing (UAT) SHOULD be performed and pass.
1. Full system regression tests MUST be run and pass. Regression tests SHOULD be fully automated.

**Data**: Test data only

**What next**: Manually trigger deployment to [Preprod](#preprod-environment).

### Preprod environment

**Description**:

- Typically long-lived environment which is generally stable because changes are deployed to this environment in a controlled manner to avoid disrupting tests while they are being performed.
- Deployments to this environment MUST be triggered by a manual approval step.
- Unlike earlier environments, all components that the team is responsible for MUST be deployed in this environment, and integrations with external dependencies MUST be in place.
- Non-production instances of external dependencies SHOULD be used where practical.

**Size**: Large (Replica of Production)

**Quality checks**

1. Functional sanity testing MUST be done and pass for every deployment.
1. Performance and load testing SHOULD be done and pass (not on every deployment but at some agreed maximum interval).
1. Penetration testing MUST be done and pass (not on every deployment but at some agreed maximum interval).

**Data**: Test data only

**What next**: If all in-scope checks pass, automatically trigger deployment to [Production](#production-environment).

### Production environment

**Description**:

- Stable environment consisting of all production components.

**Size**: Large

**Quality checks**: Functional smoke tests MUST be done and pass. Failure MUST trigger alerts and MAY trigger automatic rollback.

**Data**: Live

**What next**: Automatically trigger deployment to [Training](#training-environment).

### Training environment

**Description**:

- Generally stable environment used for training requirements.
- Consists of all components deployed to production.
- This environment is optional.

**Size**: Small

**Quality checks**: None

**Data**: Test data only