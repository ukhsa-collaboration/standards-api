# Threat Modelling

## Introduction
Threat modelling helps teams identify and mitigate risks early in the design phase. It ensures that security concerns are addressed proactively and that mitigations are built into the system from the start.

## Guidance
- Threat modelling MUST be performed for all new features and services.
- Teams MUST use a structured approach such as the [OWASP Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process), which includes consideration of STRIDE attacks: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
- Outputs MUST be translated into security user stories or acceptance criteria.
- Business impacts MUST be clearly defined and human-readable.

## Measurement

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| TM-1 | Threat models are version-controlled | Stored in repo and updated | Stored but not updated | Not stored |
| TM-2 | Security stories linked to delivery tickets | All threats mapped to stories | Some threats mapped | No linkage present |
