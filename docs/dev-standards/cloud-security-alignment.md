# Cloud security alignment

## Introduction

Cloud services **MUST** be designed and operated securely to protect sensitive data, maintain service availability and support public trust.

This guidance helps teams build secure systems by aligning with cloud provider best practices, enforcing strong access controls and ensuring visibility through logging and monitoring.

## Guidance

Teams **MUST**:

- follow the **[AWS][1]** or **[Azure][2]** **Well-Architected Framework** security pillar
- encrypt all data **in transit** and **at rest** using [approved cryptographic standards][3]
- apply the **principle of least privilege** to all **IAM policies**, roles and permissions
- enable **centralised logging and monitoring**, integrated with the **Security Operations Centre (SOC)**
- plan **SOC onboarding** early in the delivery lifecycle to ensure timely integration and alerting coverage

## Measurement

| ID    | Indicator                                     | Green                                                     | Amber                                      | Red                        |
| ----- | --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------ | -------------------------- |
| CSA-1 | Cloud architecture reviews documented         | Reviewed and signed off by TRB                            | Reviewed informally                        | Not reviewed               |
| CSA-2 | Data encryption applied                       | Encrypted in transit and at rest using approved standards | Partial encryption or non-standard methods | Not encrypted              |
| CSA-3 | IAM policies follow least privilege           | All roles scoped to minimum required access               | Some roles overly permissive               | No access control strategy |
| CSA-4 | Logging and alerting configurations validated | Validated and tested                                      | Configured but not tested                  | Not configured             |
| CSA-5 | SOC onboarding completed                      | SOC integrated and alerting live                          | SOC engagement initiated                   | No SOC engagement          |

## References

- [Appendix: Approved cryptographic standards][3]
- [AWS Well-Architected Framework – Security Pillar][1]
- [Azure Well-Architected Framework – Security Pillar][2]

[1]: https://docs.aws.amazon.com/wellarchitected/latest/framework/security.html
[2]: https://learn.microsoft.com/en-us/azure/well-architected/security
[3]: ../appendix/approved-cryptographic-standards/
