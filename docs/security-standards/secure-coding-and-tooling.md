# 5. Secure Coding and Tooling

## Introduction
Secure coding practices and automated tooling are essential to prevent vulnerabilities and maintain code quality. These practices help teams detect issues early and reduce the cost of remediation.

## Guidance
- Code MUST be linted and statically analysed before merge.
- Secrets MUST NOT be committed to source control.
- Teams SHOULD use tools such as SonarCloud, Snyk, and detect-secrets.
- Software Composition Analysis (SCA) MUST be used to detect supply chain risks.
- CI/CD jobs SHOULD be short and isolated; long-running scans MAY be run asynchronously.

## Measurement

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SCT-1 | Static analysis and secrets scanning in CI/CD | Enforced on all branches | Enforced on main only | Not enforced |
| SCT-2 | Code coverage and SCA reports reviewed | Reviewed regularly | Reviewed occasionally | Not reviewed |
