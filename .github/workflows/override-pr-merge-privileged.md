# GitHub Actions Workflow: `override-pr-merge-privileged.yml`

This document explains the purpose, logic, and security rationale behind the [`.github/workflows/override-pr-merge-privileged.yml`](./override-pr-merge-privileged.yml) workflow in this repository.

## Purpose and Overview

This workflow is the **second stage** of a pull request (PR) merging process. It works in tandem with the [`override-pr-merge-init.yml`](./override-pr-merge-init.md) workflow to allow privileged users to trigger a fast-forward merge of a PR by commenting `/merge` on an open pull request.

The workflow ensures that only users with `write` or `admin` permissions can perform this action, and that the PR is in a clean, mergeable state. It provides clear feedback to users and maintains a full audit trail of the event and actions taken.

## How Does It Work?

### 1. Triggering

- The workflow is triggered by a `workflow_run` event, specifically when the `Override PR Merge Initialise` workflow completes.
- It only proceeds if the initial workflow succeeded and the event was an `issue_comment` with `/merge` on an open PR.

### 2. Importing and Validating Event Data

- Downloads the event artifact created by the initial workflow, which contains the full GitHub event payload (including the PR and comment details).
- Validates that:
  - The event was a comment on a PR.
  - The comment was `/merge`.
  - The PR is open.

### 3. Re-Checking User Permissions

- Fetches the commenter's current repository permissions using the GitHub API.
- Ensures the user still has `write` or `admin` access at the time of merge.

### 4. Fast-Forward Merging

- If all checks pass and the PR is in a `clean` (mergeable) state:
  - Checks out the PR branch and the base branch.
  - Rebases the base branch onto the PR branch (fast-forward merge).
  - Pushes the updated base branch to GitHub.
- If the PR is not mergeable (e.g., conflicts), it does not attempt the merge.

### 5. Feedback and Audit Trail

- Posts a comment on the PR indicating success or failure, with a link to the workflow run for details.
- If any step fails, posts a failure comment and provides troubleshooting information.
- Maintains a full audit trail by saving event data and merge results.

## Why Is This Workflow Needed?

- **True Fast-Forward Merges:** GitHub's "Rebase and merge" option is not a true fast-forward merge. Instead, it rewrites commit SHAs and and the process strips any commit signatures, which can break commit verification and audit trails. This workflow enables a genuine fast-forward merge, preserving original commit SHAs and signatures (at least until GitHub support a true fast-forward merge).
  - See: [GitHub Docs – About merge methods on GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#rebasing-and-merging-your-commits)
  - See: [GitHub Community - Feature Request: Only allow for --ff merges for PRs](https://github.com/orgs/community/discussions/4618)
  - See: [GitHub Community – GPG signature lost when merging a PR](https://github.com/orgs/community/discussions/10410)

- **Preserves Conventional Commit History:** True fast-forward merges retains the original commits and their message structure intact, which is especially valuable for our adoption of [Conventional Commits](https://www.conventionalcommits.org/). Unlike GitHub's `squash-merges` which combine all changes into a single commit with limited control over the structure of the final commit message (making it difficult to ensure it adheres to the conventional commit standard). This enables automated changelog generation, better traceability of features and fixes, and more meaningful project history.
