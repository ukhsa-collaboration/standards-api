# DORA metrics

## Introduction

[DevOps Research and Assessment (DORA) metrics][2] help teams measure and improve how quickly and safely they deliver software. They focus on the flow of work from code commit to production, and are a key indicator of delivery performance.

These metrics are used across the industry to benchmark engineering teams and support continuous improvement. They are especially useful for identifying bottlenecks and improving team agility.

## Guidance

Teams **MUST** measure and review [DORA][2] metrics at least every two weeks.

The four metrics are:

1. [Deployment frequency](#deployment-frequency)
2. [Lead time for changes](#lead-time-for-changes)
3. [Change failure rate](#change-failure-rate)
4. [Time to restore service](#time-to-restore-service)

## The metrics

### Deployment frequency

**Deployment frequency** measures how often code is deployed to production.

Frequent, small deployments are preferred because they:

- reduce the risk of each change
- make it easier to identify and fix issues
- shorten the time to deliver value to users

Teams **SHOULD** aim to deploy at least weekly, and ideally daily or more often.

### Lead time for changes

**Lead time for changes** measures the time from code being merged to it running in production.

Shorter lead times:

- reduce the amount of undeployed work in the system
- allow faster feedback and learning
- make it easier to respond to issues or change priorities

This metric is different from cycle time, which includes the time spent implementing the change.

Teams **SHOULD** aim for lead times of minutes or hours, and no more than a few days.

### Change failure rate

**Change failure rate** is the percentage of deployments that cause a failure in production.

Some failures are expected — the goal is not to eliminate them entirely, but to reduce their impact and recover quickly.

Teams **SHOULD** focus on improving recovery time rather than chasing zero failures, which can lead to over-engineering and slower delivery.

A failure might include:

- a bug that affects users
- a rollback or hotfix
- a degraded service

### Time to restore service

**Time to restore service** measures how long it takes to recover from a production incident.

Short recovery times:

- reduce the impact on users and the business
- build confidence in the team’s ability to respond
- support faster iteration and learning

Teams **SHOULD** aim to restore service in minutes or hours, not days.

## Measurement

| ID     | Indicator               | Green            | Amber       | Red              |
| ------ | ----------------------- | ---------------- | ----------- | ---------------- |
| DORA-1 | Deployment frequency    | Daily or more    | Weekly      | Less than weekly |
| DORA-2 | Lead time for changes   | Minutes or hours | 1 to 3 days | More than 3 days |
| DORA-3 | Change failure rate     | <10%             | 10–20%      | >20%             |
| DORA-4 | Time to restore service | <1 hour          | 1–4 hours   | >4 hours         |

## References

- [DORA metrics: How to measure Open DevOps success – Atlassian][1]
- [DORA’s software delivery metrics: the four keys][2]

[1]: https://www.atlassian.com/devops/frameworks/dora-metrics
[2]: https://dora.dev/guides/dora-metrics-four-keys
