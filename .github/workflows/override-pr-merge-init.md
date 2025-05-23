# GitHub Actions Workflow: `override-pr-merge-init.yml`

This document explains the purpose, logic, and security rationale behind the [`.github/workflows/override-pr-merge-init.yml`](./.github/workflows/override-pr-merge-init.yml) workflow in this repository.

## Overview

This workflow is the **first phase** of a two-phase secure PR merge process designed to control and secure the merging of pull requests (PRs) via a special `/merge` command in PR comments. It ensures that only users with sufficient repository permissions (`write` or `admin`) can trigger a merge, and provides clear feedback to users who lack the required permissions.

If the user passes these checks, a second workflow, [`override-pr-merge-privileged.yml`](./override-pr-merge-privileged.md), is triggered to perform the actual fast-forward merge and post the final result.

## When Does This Workflow Run?

- **Trigger:** The workflow is triggered when a new comment is created on an issue or pull request (`issue_comment` event, type `created`).
- **Conditions:**
  - The comment must be on a pull request (not just an issue).
  - The comment body must exactly match `/merge`.
  - The PR must be open (not closed).

## What Does the Workflow Do?

### 1. Checks User Permissions

- The workflow determines the GitHub username of the commenter.
- It uses the GitHub CLI (`gh api`) to fetch the user's permission level on the repository (e.g., `read`, `triage`, `write`, `maintain`, `admin`).
- The permission is stored for use in later steps.

### 2. Handles Insufficient Permissions

- If the user **DOES NOT** have `write` or `admin` permissions:
  - The workflow posts a comment on the PR stating that the user does not have permission to merge the PR and should contact a member of the [API Standards Team](https://github.com/orgs/ukhsa-collaboration/teams/api-standards-team) for assistance.
  - The workflow fails with a clear error message, preventing any further merge automation.

### 3. Event Payload Publishing

- If the user **DOES** have `write` or `admin` permissions:
  - The workflow saves the full event payload (the GitHub event data) as an artifact for for use with the second phase of the workflow, but its also useful for auditing or debugging purposes.

## Why Is This Workflow Needed?

- **True Fast-Forward Merges:** GitHub's "Rebase and merge" option is not a true fast-forward merge. Instead, it rewrites commit SHAs and and the p'cess s'rips any commit signatures, which can break commit verification and audit trails. This workflow enables a genuine fast-forward merge, preserving original commit SHAs and signatures (at least until GitHub support a true fast-forward merge).
  - See: [GitHub Docs – About merge methods on GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#rebasing-and-merging-your-commits)
  - See: [GitHub Community - Feature Request: Only allow for --ff merges for PRs](https://github.com/orgs/community/discussions/4618)
  - See: [GitHub Community – GPG signature lost when merging a PR](https://github.com/orgs/community/discussions/10410)

- **Preserves Conventional Commit History:** True fast-forward merges retains the original commits and their message structure intact, which is especially valuable for our adoption of [Conventional Commits](https://www.conventionalcommits.org/). Unlike GitHub's `squash-merges` which combine all changes into a single commit with limited control over the structure of the final commit message (making it difficult to ensure it adheres to the conventional commit standard). This enables automated changelog generation, better traceability of features and fixes, and more meaningful project history.
