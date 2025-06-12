# 8. Penetration Testing

## Introduction

Penetration testing provides an independent assessment of a system’s security posture. It helps identify vulnerabilities that may not be caught through automated tools or internal reviews.

## Guidance

- All services MUST undergo penetration testing before their first release to production.
- Penetration testing MUST be repeated at least annually.
- Penetration testing MUST also be repeated after any significant architectural change.
- Findings from penetration tests MUST be tracked and remediated in a timely manner.

## Measurement

| ID   | Indicator                                            | GREEN                             | AMBER                           | RED                        |
| ---- | ---------------------------------------------------- | --------------------------------- | ------------------------------- | -------------------------- |
| PT-1 | Initial pen test completed before production release | Completed and documented          | Completed but not documented    | Not completed              |
| PT-2 | Annual or change-driven pen tests conducted          | Tests conducted and tracked       | Tests conducted but not tracked | Not conducted              |
| PT-3 | Findings tracked and remediated                      | All findings tracked and resolved | Some findings tracked           | No tracking or remediation |
