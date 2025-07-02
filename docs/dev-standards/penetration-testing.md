# Penetration testing

## Introduction

Penetration testing helps identify vulnerabilities that may not be detected by automated tools or internal reviews. It provides an independent assessment of a system’s security posture and supports continuous improvement.

Penetration testing is especially important for systems that handle sensitive data or provide critical services.

## Guidance

Teams **MUST**:

- carry out a penetration test before the first release to production
- repeat penetration testing at least once a year
- repeat testing after any significant architectural change
- track and remediate all findings in a timely manner
- scope penetration testing based on system risk and data sensitivity
- ensure tests are conducted by qualified, independent testers

Teams **SHOULD**:

- integrate automated penetration testing tools into CI/CD pipelines to detect common vulnerabilities earlier in the delivery process
- use test environments that closely mirror production to improve the accuracy of findings
- include penetration testing in incident response exercises to validate detection and response capabilities
- review and update test scopes regularly to reflect changes in architecture, threat landscape or data sensitivity
- collaborate with testers during scoping to ensure coverage of high-risk areas and known weak points

## Measurement

| ID   | Indicator                          | Green                                               | Amber                           | Red                        |
| ---- | ---------------------------------- | --------------------------------------------------- | ------------------------------- | -------------------------- |
| PT-1 | Initial penetration test completed | Completed and documented                            | Completed but not documented    | Not completed              |
| PT-2 | Ongoing penetration testing        | Annual or change-driven tests conducted and tracked | Tests conducted but not tracked | Not conducted              |
| PT-3 | Findings tracked and remediated    | All findings tracked and resolved                   | Some findings tracked           | No tracking or remediation |

## References

- [NCSC Penetration Testing Guidance](https://www.ncsc.gov.uk/guidance/penetration-testing)
- [OWASP Penetration Testing Guide](https://owasp.org/www-project-web-security-testing-guide)
