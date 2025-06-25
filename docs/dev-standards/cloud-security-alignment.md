# Cloud Security Alignment

## Introduction

Cloud services must be designed and operated securely to protect sensitive data and maintain service integrity. This includes aligning with cloud provider best practices and ensuring visibility through logging and monitoring.

## Guidance

- Teams MUST align with AWS or Azure Well-Architected Framework security pillars.
- Data MUST be encrypted in transit and at rest.
- IAM policies MUST follow the principle of least privilege.
- Logging and monitoring MUST be enabled and integrated with the Security Operations Centre (SOC).
- SOC onboarding MUST be planned early in the delivery lifecycle.

## Measurement

| ID    | Indicator                                     | GREEN                   | AMBER                     | RED            |
| ----- | --------------------------------------------- | ----------------------- | ------------------------- | -------------- |
| CSA-1 | Cloud architecture reviews documented         | Reviewed and signed off | Reviewed informally       | Not reviewed   |
| CSA-2 | Logging and alerting configurations validated | Validated and tested    | Configured but not tested | Not configured |
