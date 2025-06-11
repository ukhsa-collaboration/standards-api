# Source control

## Git

- All code MUST be version controlled using git.
- Code SHOULD wherever possible be stored in GitHub, in either [UKHSA-Internal](https://github.com/UKHSA-Internal) or [ukhsa-collaboration](https://github.com/ukhsa-collaboration), as appropriate.

## Commits

- Commits MUST be small and cohesive.
- Commit messages MUST be brief, clear and accurate.
    - They SHOULD include a work-item reference, typically a Jira ID.
    - They MAY follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- All commits SHOULD be signed.

## GitHub Flow

- The default branch in each repository MUST be `main` (preferred) or `master`.
- Changes MUST ONLY be merged to this default branch if they are ready to deploy.
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) SHOULD be used.
- This default branch SHOULD be the only long-lived branch in the repository.
- Each change SHOULD be developed on its own "feature" branch (though see below for an extended set of short-lived branch types). These branches MUST be short-lived, ideally hours or days, at most a couple of weeks.
- Branch names SHOULD include a prefix that indicates the nature of the change, as follows:
    - `feature/`: functional changes that deliver user or business value, including documentation changes. Should be kept up to date with `main` HEAD.
    - `bugfix/`: changes that fix a bug. Should be kept up to date with `main` HEAD.
    - `spike/`: experimental changes that SHOULD NOT be merged to `main`.
    - `hotfix/`: emergency changes to fix a problem in a version of the software deployed in production. Typically created from a [release tag](#tags).

## Tags

- When changes are deployed to Production, a tag SHOULD be added to the deployed commit. If the deployed component is versioned (e.g. using semantic versioning) the tag SHOULD indicate the version. 

## GitHub pull requests:

- _Allow merge commits_ MAY be enabled.
- _Allow squash merging_ SHOULD be enabled.
- _Allow rebase merging_ MAY be enabled.
- _Allow auto-merge_ SHOULD be enabled.
- _Automatically delete head branches_ SHOULD be enabled.

## GitHub branch protections

The following applies to the default `main`/`master` branch. The aim is to strongly protect this branch and enforce the associated quality processes. Either a new style Ruleset (preferred) or an old style branch protection rule MUST be configured for this default branch.

### (New style) Ruleset --- preferred

- There MUST NOT be any roles, teams configured in the _bypass list_.
- _Restrict deletions_ MUST be enabled.
- _Require signed commits_ SHOULD be enabled.
- _Require a pull request before merging_ MUST be enabled.
- _Require status checks to pass_ MUST be enabled.
- _Block force pushes_ MUST be enabled.

### (Old style) Branch protection rule

- _Require a pull request before merging_ MUST be enabled.
- _Require approvals_ MUST be enabled with at least one approval required.
- _Dismiss stale pull request approvals when new commits are pushed_ MUST be enabled.
- _Require review from Code Owners_ MAY be enabled when required.
- _Allow specified actors to bypass required pull requests_ MUST NOT be enabled.
- _Require approval of the most recent reviewable push_ MUST be enabled.
- _Require status checks to pass before merging_ MUST be enabled.
- _Require branches to be up to date before merging_ MUST be enabled.
- _Require conversation resolution before merging_ MUST be enabled.
- _Require signed commits_ SHOULD be enabled.
- _Do not allow bypassing the above settings_ MUST be enabled.
- _Allow force pushes_ MUST NOT be enabled.
- _Allow deletions_ MUST NOT be enabled.