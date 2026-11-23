# Contributing to UKHSA API Guidelines

Thank you for your interest in contributing to the UKHSA API Guidelines! This repository contains guidelines and best practices for designing, developing, and maintaining APIs at UKHSA.

## Table of Contents

- [Contributing to UKHSA API Guidelines](#contributing-to-ukhsa-api-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Setting Up Your Development Environment](#setting-up-your-development-environment)
      - [1. Fork the repository](#1-fork-the-repository)
      - [2. Clone the repository](#2-clone-the-repository)
      - [3. Install dependencies](#3-install-dependencies)
      - [4. Compile TypeScript](#4-compile-typescript)
    - [Understanding the Repository Structure](#understanding-the-repository-structure)
  - [Contributing Process](#contributing-process)
    - [Finding Issues to Work On](#finding-issues-to-work-on)
    - [Signed Commits](#signed-commits)
      - [1. Generate a GPG key (if you don't have one already)](#1-generate-a-gpg-key-if-you-dont-have-one-already)
      - [2. Configure Git to use your GPG key](#2-configure-git-to-use-your-gpg-key)
      - [3. Add your GPG key to GitHub](#3-add-your-gpg-key-to-github)
      - [4. Sign your commits](#4-sign-your-commits)
    - [Opening New Issues](#opening-new-issues)
    - [Making Changes](#making-changes)
      - [Example](#example)
      - [Remediating the legacy `spectral` scope](#remediating-the-legacy-spectral-scope)
    - [Pull Request Process](#pull-request-process)
  - [Development Guidelines](#development-guidelines)
    - [Documentation Standards](#documentation-standards)
    - [Linting Rules Development](#linting-rules-development)
    - [Testing Guidelines](#testing-guidelines)
  - [Viewing the Guidelines Locally](#viewing-the-guidelines-locally)
  - [Documentation Deployment](#documentation-deployment)
  - [Ruleset Release](#ruleset-release)
    - [1. Update the Version Number](#1-update-the-version-number)
    - [2. Document the Changes](#2-document-the-changes)
    - [3. Create a Release](#3-create-a-release)

## Code of Conduct

Please read the [Code of Conduct][33] before contributing.

## Getting Started

### Setting Up Your Development Environment

#### 1. Fork the repository

If you're an external contributor make sure to [fork this project first][34]

#### 2. Clone the repository

If you are a member of the `ukhsa-collaboration` GitHub organisation, you can clone the repository directly:

```bash
git clone https://github.com/ukhsa-collaboration/standards-api.git
cd standards-api
```

Otherwise, if you are an external contributor, you can clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/standards-api.git
cd standards-api
```

#### 3. Install dependencies

Before you begin, ensure you have the following installed:

| Tool | Version | Description |
| - | - | - |
| [Node.js][35] / npm | `Latest LTS` | Required for packaging and testing the linting ruleset. |
| [Vacuum][36] | `Latest` | CLI for running the UKHSA linting ruleset. |

You can install npm and Vacuum CLI using your system's package manager or download them from their respective websites.

You can verify your installations with:

```bash
node --version
npm --version
vacuum --version
```

install the required dependencies with the following command:

```bash
npm install
```

#### 4. Compile TypeScript

To transpile TypeScript files to JavaScript:

```bash
npm run build
```

Build the Vacuum-compatible functions (used by the linter at runtime) with:

```bash
npm run build:functions:cjs
```

This generates `.js` files in `./dist` and produces Vacuum wrapper functions in `./dist/functions`.

### Understanding the Repository Structure

- `/docs/` - Documentation content written in Markdown
- `/docs/api-design-guidelines/` - API design guidelines content
- `/docs/linting-rules/` - Documentation for API linting rules
- `/example/` - Example OpenAPI specifications
- `/src/functions/` - JavaScript functions used by the linting rules
- `ukhsa.oas.rules.yml` - UKHSA-specific linting rules
- `zalando.oas.rules.yml` - Zalando API guidelines rules

## Contributing Process

### Finding Issues to Work On

- Check the [Issues][37] section for open tasks
- Look for issues tagged with `good first issue` if you're new to the project

### Signed Commits

All commits to this repository **MUST** be signed with a GPG key to verify the committer's identity. This helps ensure the security and integrity of the codebase.

To set up signed commits:

#### 1. Generate a GPG key (if you don't have one already)

```bash
gpg --full-generate-key
```

#### 2. Configure Git to use your GPG key

```bash
# List your GPG keys to get the ID
gpg --list-secret-keys --keyid-format=long

# Configure Git to use your key (replace KEY_ID with your GPG key ID)
git config --global user.signingkey KEY_ID

# Enable commit signing by default
git config --global commit.gpgsign true
```

#### 3. Add your GPG key to GitHub

- Export your public key: `gpg --armor --export KEY_ID`
- Add this key to your GitHub account under Settings > SSH and GPG keys

#### 4. Sign your commits

```bash
# If you've enabled signing by default, just commit normally
git commit -m "Your commit message"

# Or explicitly sign a commit
git commit -S -m "Your commit message"
```

For more information, see GitHub's documentation on [signing commits][38].

### Opening New Issues

Before opening a new issue:

1. **[Search existing issues][39]** to avoid duplicates
1. **Use issue templates** if available
1. **Be clear and specific** about:
   - What needs to be changed/added
   - Why it's important
   - Any relevant context

### Making Changes

1. **Create a new branch** for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   or

   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

1. **Make your changes** following the [development guidelines][23] below.

1. **Test your changes** (see [Testing Guidelines][26])

1. **Commit your changes** with clear commit messages and sign them (see [Signed Commits][13]):

We follow the [Conventional Commits][40] specification for commit messages. This provides a standardised format that makes the commit history more readable and enables automated tools for versioning and changelog generation.

The commit message should be structured as follows:

```text
Subject:
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: "linting-rules" for changes to linting rules or should be omitted otherwise
  │
  └─⫸ Commit Type: build|docs|feat|fix|perf|refactor|revert|test

Body:
<detailed description of changes made in the commit> (wrap at 72 characters)

Footer:
<any additional information, such as references or issue numbers>
```

| Type | Description | SemVer Impact |
| - | - | - |
| `build` | A change to CI configuration files and scripts, or that affect the build system or external dependencies | None (*unless functionality is affected*) |
| `docs` | Documentation only changes | None |
| `feat` | A new feature | MINOR (`x.Y.z`) |
| `fix` | A bug fix | PATCH (`x.y.Z`) |
| `perf` | A code change that improves performance | PATCH (`x.y.Z`) |
| `refactor` | A code change that improve code quality but have no functional effect | None (*unless functionality is affected*) |
| `revert` | Reverts a previous commit | Depends on the reverted change |
| `test` | Adding or correcting tests | None |

> [!NOTE]
> A commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with [`MAJOR`][41] in Semantic Versioning). A BREAKING CHANGE can be part of commits of any *type*.

#### Example

```bash
git commit -m "feat(scope): add rate limiting recommendations"
```

or with more details:

```bash
git commit -m "fix(scope): correct validation for API versioning

Resolves issue #123"
```

#### Remediating the legacy `spectral` scope

The `spectral` scope was retired when the ruleset moved from Spectral to Vacuum. It is no longer an allowed scope, and `linting-rules` is the canonical replacement.

Merged history is **not** rewritten — commits already on `main` keep the old scope.

Branches opened before the change are a different matter. The commit linting workflow validates every commit in a pull request, not just the latest one, so a branch carrying a `spectral` scoped commit will fail the check. If that affects your branch:

1. Rebase interactively onto the latest `main`:

   ```bash
   git fetch
   git rebase -i origin/main
   ```

1. Mark each commit whose scope is `spectral` as `reword`, then change the scope to `linting-rules`, or omit the scope entirely if the commit does not change the linting rules:

   ```text
   # before
   feat(spectral): enforce x-audience in the info block

   # after
   feat(linting-rules): enforce x-audience in the info block
   ```

1. Force push the rebased branch:

   ```bash
   git push --force-with-lease origin your-branch-name
   ```

> [!NOTE]
> Rebasing replays your work as new commits, which must be signed. If you have > `commit.gpgsign` set to `true` as described in [Signed Commits][signed-commits], > `git rebase` honours it automatically; otherwise pass `-S` to `git rebase`.

### Pull Request Process

1. **Update your branch/fork** with the latest from upstream:

   If you are an external contributor, you will need to add the upstream repository as a remote, see [fork the repository][6] for more details.

   Make sure to keep your fork up to date with the main repository by [syncing your fork][42] with the upstream repository.

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can update your branch with the latest from `main` with the following commands:

   ```bash
   git fetch
   git rebase origin/main
   ```

   > [!NOTE]
   > This repository maintains a [linear commit history][43].
   >
   > Always use [`rebase`][44] instead of `merge` when keeping your branch up to date with the `main` branch.

1. **[link PR to issue][45]** if you are solving one.

1. **Push your changes** to your branch/fork:

   If its your first push to the branch you can use:

   ```bash
   git push -u origin your-branch-name
   ```

   or if you have already pushed to the branch you can use:

   ```bash
   git push origin your-branch-name
   ```

   If you've previously pushed your branch and have rebased, you may need to force push:

   ```bash
   git push --force-with-lease origin your-branch-name
   ```

1. **Create a Pull Request** from your branch/fork to the main repository

   if you are a member of the `ukhsa-collaboration` GitHub organisation, you can create a [pull request][46] directly from your branch.

   If you are an external contributor, you can create a [pull request from your fork][47] to the main repository.

1. **Fill in the PR template** with all relevant information

1. **Request a review** from maintainers

1. **Address any feedback** provided during the review process. When making changes to address feedback:
   - Make additional commits while the PR is under review
   - Once approved, consider squashing related commits for a cleaner history
   - Use descriptive commit messages that explain the changes

1. **Prepare for merge**: Before your PR is merged, make sure your branch is up to date with the latest changes from the `main` branch.

   You should be able to do this from the [GitHub UI][48] or from the command line.

   If you are an external contributor, you can use the following commands to keep your branch up to date with the `main` branch:

   ```bash
   # from your feature branch
   git fetch upstream
   git rebase upstream/main
   ```

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can use the following commands to keep your branch up to date with the `main` branch:

   ```bash
   # from your feature branch
   git fetch
   git rebase origin/main
   ```

   Occasionally you may also be asked to squash your commits to maintain a clean project history. If you are an external contributor, you can use the following commands to squash your commits:

   ```bash
   # Squash multiple commits into one
   git rebase -i HEAD~{number of commits to squash}
   # and follow the instructions in the editor to squash your commits
   # or squash all commits since branching from main
   git fetch upstream
   git rebase -i upstream/main
   ```

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can use the following commands to squash your commits:

   ```bash
   # Squash multiple commits into one
   git rebase -i HEAD~{number of commits to squash}
   # and follow the instructions in the editor to squash your commits
   # or squash all commits since branching from main
   git fetch
   git rebase -i origin/main
   ```

   > [!NOTE]
   > This repository maintains a [linear commit history][43].
   >
   > Always use [`rebase`][43] instead of `merge` when keeping your branch up to date with the `main` branch (see previous step).

1. **Merge the PR**: Once approved and all status checks have passed, including the branch being up to date with main, you can trigger a `fast-forward` merge by adding the `fast-forward` label to the pull request. This will initiate an automated, permission-checked `fast-forward` merge process. Only users with `write` or `admin` permissions on the repository can trigger this action. If you're an external contributor, a maintainer may need to do this for you, as the automated process only responds to this tag when it has been added by an authorised user.

   The merge process is handled by our two-phase GitHub Actions workflow:

   - **[Phase 1][49]:** Checks your permissions and PR status when you add the `fast-forward` label.
   - **[Phase 2][50]:** If you have sufficient permissions and the PR is mergeable, the workflow will perform a true `fast-forward` merge and post the result as a comment on the PR.

   If you do not have permission, the workflow will notify you and request you contact a member of the [API Standards Team][51].

   Information on why we use a non-standard GitHub merge process can be found in the [`fast-forward-pr-merge-init.md`][52] documentation.

2. Congratulations! 🎉🎉 You've successfully contributed to the UKHSA API Guidelines, any documentation changes will be automatically deployed to the [UKHSA Organisation standards][53] site.

## Development Guidelines

### Documentation Standards

- Write in clear, concise language suitable for technical audiences.
- Use [RFC2119][54] keywords (**MUST**, **SHOULD**, **MAY**, etc.) correctly to indicate requirement levels.
- Include practical examples where appropriate.
- Follow Markdown best practices for formatting.
- Place documentation in the appropriate section of the `/docs/` directory.
- Preview changes locally using `npm start` before submitting.

### Linting Rules Development

Vacuum is the supported CLI for running the UKHSA ruleset. Rules are authored in the ruleset format that Vacuum consumes.

- For rule syntax and guidance, see [Custom Rulesets][55].

- UKHSA specific rules are defined in the `ukhsa.oas.rules.yml` file.

- Rules should be clearly categorised as **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY**, **MAY NOT** and matched against the appropriate [severity level][56].

  | Rule Category | Severity Level |
  | - | :-: |
  | **MUST** | `error` |
  | **MUST NOT** | `error` |
  | **SHOULD** | `warn` |
  | **SHOULD NOT** | `warn` |
  | **MAY** | `info` or `hint` |
  | **MAY NOT** | `info` or `hint` |

- Each rule should have a corresponding documentation file in the relevant folder `/docs/linting-rules/must/`, `/docs/linting-rules/should/` or `/docs/linting-rules/may/`.

- Every rule definition **MUST** set `documentationUrl` so Vacuum outputs can surface a deep link to the matching documentation page (for example `https://ukhsa-collaboration.github.io/standards-org/api-design-guidelines/linting-rules/must/<rule-name>/`).

- Include references to the relevant sections of the API guidelines.

- [Test the rules][26] that you have created or modified.

- For information on how to use these rules with your API project, check the [How to use the rules][57] documentation section.

### Testing Guidelines

- Test new rules against the example specifications in the `/example/` directory (you may need to modify the example definition to test your rules). Vacuum auto-discovers `./vacuum.conf.yaml` from the working directory.

  ```bash
  vacuum lint example/example.1.0.0.oas.yml
  ```

- Verify that rules produce the expected results for both valid and invalid API definitions.

- Add automated tests for each new rule:
  1. Define the rule in `ukhsa.oas.rules.yml`.
  1. Create a Jest test file in:
     ```text
     src/__tests__/rules/<rule-name>.test.ts
     ```
  1. Use the Vacuum test helper to run the rule against inline specs:
     ```ts
     import testRule from '../__helpers__/vacuum-helper.js';

     testRule('<rule-name>', [
       {
         name: 'passes when condition is met',
         document: `
           openapi: 3.0.0
           info:
             title: My API
             version: 1.0.0
           paths: {}
         `,
         errors: [],
       },
       {
         name: 'fails when condition is not met',
         document: `
           openapi: 3.0.0
           info:
             title: Bad API
             version: 1.0.0
           paths: {}
         `,
         errors: [{ code: '<rule-name>' }],
       },
     ]);
     ```

- Run the rule tests:
  ```bash
  npm run test
  ```

- For documentation, serve the site locally (see [Viewing the Guidelines Locally][27])

## Viewing the Guidelines Locally

The documentation is organised into various markdown files under the `docs/` directory. You can navigate and edit these files directly. To preview the documentation as it will appear on the website:

```bash
npm run start
```

This uses docker to host your docs under the hood.
After running this script you can view your docs by going to [http://localhost:8080/api-design-guidelines/][58].

While this script is running it will notice when files change and update them so you can see how they look live.

## Documentation Deployment

The documentation is continuously deployed from the `main` branch by GitHub Actions, using the workflow defined in `/.github/workflows/publish-guidelines.yml` which will trigger a deployment of the main [standards-org][59] repository

When documentation changes are merged into the `main` branch, the documentation site is automatically updated and re-published on GitHub Pages.

## Ruleset Release

When updating rules, follow these steps to ensure proper release and distribution:

### 1. Update the Version Number

- Update the version number in `package.json` following [Semantic Versioning][60] principles:
  - `MAJOR` version for incompatible changes
  - `MINOR` version for added functionality in a backwards compatible manner
  - `PATCH` version for backwards compatible bug fixes

### 2. Document the Changes

- Document all changes in a `CHANGELOG.md` file, including:
  - New rules added
  - Existing rules modified
  - Rules deprecated or removed
  - Bug fixes

### 3. Create a Release

- Trigger the `/.github/workflows/publish-rules.yml` workflow to create a release using GitHub Actions.
- Add detailed release notes.
- [Tag the release][61] with the version number.

> [!NOTE]
> Only maintainers with the appropriate permissions can publish new releases of the ruleset npm package.

Thank you for contributing to improving API design and development practices across the UKHSA!

[1]: #contributing-to-ukhsa-api-guidelines
[2]: #table-of-contents
[3]: #code-of-conduct
[4]: #getting-started
[5]: #setting-up-your-development-environment
[6]: #1-fork-the-repository
[7]: #2-clone-the-repository
[8]: #3-install-dependencies
[9]: #4-compile-typescript
[10]: #understanding-the-repository-structure
[11]: #contributing-process
[12]: #finding-issues-to-work-on
[13]: #signed-commits
[14]: #1-generate-a-gpg-key-if-you-dont-have-one-already
[15]: #2-configure-git-to-use-your-gpg-key
[16]: #3-add-your-gpg-key-to-github
[17]: #4-sign-your-commits
[18]: #opening-new-issues
[19]: #making-changes
[20]: #example
[21]: #signed-commits
[22]: #pull-request-process
[23]: #development-guidelines
[24]: #documentation-standards
[25]: #linting-rules-development
[26]: #testing-guidelines
[27]: #viewing-the-guidelines-locally
[28]: #documentation-deployment
[29]: #ruleset-release
[30]: #1-update-the-version-number
[31]: #2-document-the-changes
[32]: #3-create-a-release
[33]: ./CODE_OF_CONDUCT.md
[34]: https://help.github.com/articles/fork-a-repo/
[35]: https://nodejs.org/en/download/
[36]: https://quobix.com/vacuum/installing/
[37]: https://github.com/ukhsa-collaboration/standards-api/issues
[38]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
[39]: https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments
[40]: https://www.conventionalcommits.org/
[41]: http://semver.org/#summary
[42]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork
[43]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-linear-history
[44]: https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase
[45]: https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
[46]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request
[47]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
[48]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch
[49]: ./.github/workflows/fast-forward-pr-merge-init.md
[50]: ./.github/workflows/fast-forward-pr-merge-privileged.md
[51]: https://github.com/orgs/ukhsa-collaboration/teams/api-standards-team
[52]: ./.github/workflows/fast-forward-pr-merge-init.md#why-is-this-workflow-needed
[53]: https://ukhsa-collaboration.github.io/standards-org/api-design-guidelines/
[54]: https://datatracker.ietf.org/doc/html/rfc2119
[55]: https://quobix.com/vacuum/rulesets/custom-rulesets/
[56]: https://quobix.com/vacuum/rulesets/custom-rulesets/#severity
[57]: docs/linting-rules/index.md#how-to-use-the-rules
[58]: http://localhost:8080/api-design-guidelines/
[59]: https://github.com/ukhsa-collaboration/standards-org
[60]: https://semver.org/
[61]: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release
