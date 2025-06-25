# Static analysis

Static code analysis is a cheap and quick way to detect and prevent certain classes of code quality issues.

Appropriate static analysis **MUST** be run on every pull request and pass before the pull request can be merged.

## Application programming languages

For languages such as JavaScript, Python, Java, and C#:

- [SonarQube](https://www.sonarsource.com/sem/products/sonarqube/) **MUST** be used to detect code quality issues.
- [Snyk](https://snyk.io/) **MUST** be used to detect potential security issues.
- Dependency scanning (by default with [Dependabot](https://github.com/dependabot)) **MUST** be used to detect out of date dependencies not identified by Snyk.

## Infrastructure as code

For Terraform:

- [TFLint](https://github.com/terraform-linters/tflint) **MUST** be used to detect code quality issues.
- [Checkov](https://www.checkov.io/) **MUST** be used to detect potential security issues.
- [Infracost](https://github.com/infracost/infracost) **MUST** be used to estimate the cost of resources before deployment.

## Containers

For containers:

- Image scanning (by default using built-in scanning in [ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)) **MUST** be used to detect potential security issues.
