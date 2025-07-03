# Source control

## Introduction

Version control is essential for collaboration, traceability, and quality assurance. All teams **MUST** use Git to manage source code.

This guidance explains how to use Git and approved hosting platforms consistently and securely across all projects. It supports good engineering practice, protects code integrity, and ensures compliance with internal governance.

## Guidance

### Where to store code

All source code **MUST** be stored in one of the following:

- the `UKHSA-Internal` [GitHub organisation][1]
- the `ukhsa-collaboration` [GitHub organisation][2]
- the internal GitLab server (see [Git hosting decision tree][3])

Each repository **MUST** include:

- a `README.md` that explains the purpose of the repository
- a `LICENCE` file if the repository is public

Each repository **MAY** include:

- a `CONTRIBUTING.md` file to provide contribution guidance

The default branch **MUST** be named `main` (preferred) or `master`.

### Commit practices

Commits **MUST** be:

- small and focused
- clearly described
- linked to a work item (e.g. Jira ID)

All commits **SHOULD** be [signed][5] to verify authorship and integrity. Signed commits help ensure that code changes come from trusted contributors and have not been tampered with.

Commit messages **MAY** follow the [Conventional Commits][4] format.

### Branching strategy

Teams **SHOULD** follow a [GitHub Flow][8]-style branching model.

The default branch **SHOULD** be the only long-lived branch. Feature branches **MUST** be short-lived — ideally hours or days, and no more than two weeks.

Branch names **SHOULD** use a prefix to indicate purpose:

- `feature/` — functional changes
- `bugfix/` — defect fixes
- `spike/` — experimental work (not merged)
- `hotfix/` — urgent fixes to production

### Tags and releases

When deploying to production, a Git tag **SHOULD** be added to the deployed commit.

If versioning is used, tags **SHOULD** follow [Semantic Versioning][6].

### Pull requests and merge process

All changes **MUST** be merged via a pull request (GitHub) or merge request (GitLab). These **MUST**:

- be peer reviewed
- pass all required checks before merging

Teams **SHOULD** enable:

- automatic deletion of merged branches

Teams **MAY** enable:

- auto-merge
- rebase merging
- squash merging

### Branch protection

Teams **MUST** configure protection for the default branch to prevent accidental or unauthorised changes. This **MUST** include:

- requiring pull or merge requests before merging
- requiring status checks to pass
- blocking force pushes and deletions

Platform-specific configuration (e.g. GitHub rulesets) is described in the [branch protection appendix][7].

---

## Measurement

Use these indicators to assess how well source control practices are being followed:

| ID   | Indicator                    | GREEN                                        | AMBER                            | RED                              |
| ---- | ---------------------------- | -------------------------------------------- | -------------------------------- | -------------------------------- |
| SC-1 | Branch protection configured | All required settings enforced               | Some settings missing            | No protection in place           |
| SC-2 | Commit hygiene               | Small, signed, well-described commits        | Inconsistent practices           | Large or unclear commits         |
| SC-3 | Pull request process         | All changes via PR/MR with review and checks | Some bypasses or missing reviews | Direct commits to main           |
| SC-4 | Branching strategy           | Short-lived branches with clear naming       | Mixed practices                  | Long-lived or unmanaged branches |

---

## References

- [Branch protection appendix][7]
- [Conventional commits][4]
- [Git hosting decision tree][3]
- [GitHub commit signature verification][5]
- [GitHub flow][8]
- [Semantic versioning][6]

[1]: https://github.com/UKHSA-Internal
[2]: https://github.com/ukhsa-collaboration
[3]: https://ukhsa.atlassian.net/wiki/spaces/IDT/pages/164926907/UKHSA+Git+Hosting+-+Policy+Documentation#UKHSAGitHosting-PolicyDocumentation-GitHostingDecisionTree
[4]: https://www.conventionalcommits.org
[5]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
[6]: https://semver.org
[7]: ../dev-standards/appendix/branch-protection-rules.md
[8]: https://docs.github.com/en/get-started/using-github/github-flow
