# Branch protection rules

## Introduction

Branch protection rules help prevent accidental or unauthorised changes to important branches, such as `main`. They enforce quality controls like peer review, passing tests, and signed commits.

All teams **MUST** configure branch protection for the default branch in every repository.

## GitHub

GitHub supports two types of branch protection:

- **Rulesets** (new style) — **MUST** be used for all new projects
- **Legacy branch protection rules** — acceptable for existing projects, but teams **SHOULD** migrate to rulesets

In all cases, one or the other **MUST** be in place.

### Rulesets (preferred)

GitHub [rulesets][1] provide a flexible and powerful way to enforce branch protection.

Rulesets **MUST**:

- restrict deletions
- block force pushes
- require a pull request before merging
- require status checks to pass
- require branches to be up to date before merging
- require approvals with at least one approval required
- dismiss stale pull request approvals when new commits are pushed
- require approval of the most recent reviewable push
- require code scanning results

Rulesets **SHOULD**:

- require signed commits
- match allowed merge methods to repository settings (e.g. squash, rebase, merge)

Rulesets **MAY**:

- require review from Code Owners

### Legacy branch protection rules

If rulesets are not available, teams **MUST** use GitHub’s legacy [branch protection rules][2].

Rules **MUST**:

- require a pull request before merging
- require approvals with at least one approval required
- dismiss stale pull request approvals when new commits are pushed
- require approval of the most recent reviewable push
- require status checks to pass before merging
- require branches to be up to date before merging
- require conversation resolution before merging
- block force pushes
- block deletions
- require code scanning results

Rules **MUST NOT**:

- allow bypassing of required pull requests

Rules **SHOULD**:

- require signed commits
- match allowed merge methods to repository settings

Rules **MAY**:

- require review from Code Owners

## GitLab

In GitLab, branch protection is managed through [protected branches][3].

Protected branches **MUST**:

- allow only Maintainers to merge
- require merge requests for all changes
- require approval from at least one reviewer (via merge request settings)
- require all pipeline jobs to pass before merging

Protected branches **MUST NOT**:

- allow anyone to push

Protected branches **SHOULD**:

- enable signed commits (if supported in your GitLab version)

Protected branches **MAY**:

- require Code Owner approval (available in Premium and higher tiers)

## References

- [GitHub branch protection rulesets][1]
- [GitHub legacy branch protection rules][2]
- [GitLab protected branches][3]

[1]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
[2]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule
[3]: https://docs.gitlab.com/user/project/repository/branches/protected
