# 4. Threat Modelling

## Introduction
Threat modelling helps teams identify and mitigate risks early in the design phase. It ensures that security concerns are addressed proactively and that mitigations are built into the system from the start.

## Guidance
- Threat modelling MUST be performed for all new features and services.
- Teams SHOULD use STRIDE or equivalent methodologies.
- Outputs MUST be translated into security user stories or acceptance criteria.
- Business impacts SHOULD be clearly defined and human-readable.

## Measurement

| ID   | Indicator | GREEN | AMBER | RED |
|------|-----------|--------|--------|-----|
| TM-1 | Threat models are version-controlled | Stored in repo and updated | Stored but not updated | Not stored |
| TM-2 | Security stories linked to delivery tickets | All threats mapped to stories | Some threats mapped | No linkage present |
