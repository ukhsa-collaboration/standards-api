# Security Measurement Framework

To ensure consistent and measurable adoption of secure engineering practices across UKHSA digital services, this framework defines a set of indicators for each security principle. These indicators help teams assess their current maturity, identify areas for improvement, and demonstrate progress over time.

Each indicator is accompanied by example outcomes that describe what **Achieved (GREEN)**, **Partially Achieved (AMBER)**, and **Not Achieved (RED)** look like in practice. This enables teams to self-assess in a structured and repeatable way, and supports engineering leadership in tracking security posture across the organisation.

The indicators are semantically numbered by principle (e.g. `SP-1`, `SDLC-2`) to support traceability and integration into dashboards, audits, and continuous improvement initiatives.

---

## 1. Security Principles

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| SP-1 | Security principles are documented in team ways of working | Documented and reviewed quarterly | Documented but not regularly reviewed | Not documented |
| SP-2 | Security is considered during architecture and design reviews | Security is a standing agenda item in design reviews | Security is discussed ad hoc | Security is not considered |

---

## 2. Secure Development Lifecycle (SDLC)

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SDLC-1 | Security checkpoints embedded in delivery workflows | Present in all phases | Present in some phases | Absent |
| SDLC-2 | Traceability from backlog to security reviews | Fully traceable | Partial traceability | No traceability |

---

## 3. DevSecOps Patterns

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| DSP-1 | Security patterns referenced in architecture docs | Referenced and version-controlled | Referenced informally | Not referenced |
| DSP-2 | Threat modelling and MVSP reviews completed | For all services | For some services | Rarely or never done |

---

## 4. Threat Modelling

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| TM-1 | Threat models are version-controlled | Stored in repo and updated | Stored but not updated | Not stored |
| TM-2 | Security stories linked to delivery tickets | All threats mapped to stories | Some threats mapped | No linkage present |

---

## 5. Secure Coding and Tooling

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| SCT-1 | Static analysis and secrets scanning in CI/CD | Enforced on all branches | Enforced on main only | Not enforced |
| SCT-2 | Code coverage and SCA reports reviewed | Reviewed regularly | Reviewed occasionally | Not reviewed |

---

## 6. Security Champions

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| SC-1 | Security Champion roles are documented and active | Named, trained, and engaged | Named but inactive | No champion assigned |
| SC-2 | Champions attend regular syncs | Attend monthly or more | Attend occasionally | Do not attend |

---

## 7. Cloud Security Alignment

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| CSA-1 | Cloud architecture reviews documented | Reviewed and signed off | Reviewed informally | Not reviewed |
| CSA-2 | Logging and alerting configurations validated | Validated and tested | Configured but not tested | Not configured |

---

## 8. Penetration Testing

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| PT-1 | Initial pen test completed before production release | Completed and documented | Completed but not documented | Not completed |
| PT-2 | Annual or change-driven pen tests conducted | Tests conducted and tracked | Tests conducted but not tracked | Not conducted |
| PT-3 | Findings tracked and remediated | All findings tracked and resolved | Some findings tracked | No tracking or remediation |

---

## 9. Measuring Security Maturity

| ID     | Indicator | GREEN | AMBER | RED |
|--------|-----------|--------|--------|-----|
| MSM-1 | RAG status recorded for each standard | Updated quarterly | Updated annually | Not recorded |
| MSM-2 | Trends monitored over time | Used to inform improvements | Tracked but not used | Not tracked |
